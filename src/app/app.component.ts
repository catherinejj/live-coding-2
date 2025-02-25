import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, debounceTime, filter, map, of, switchMap, tap } from 'rxjs';
import { PostsResponseDto } from './models/posts-response.dto';
import { ResultView } from './models/result.view';
import { UsersResponseDto } from './models/users-response.dto';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, // Bonne pratique : mode plus performant
  imports: [ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected searchControl = new FormControl('');

  protected result: ResultView = { loaded: true };

  constructor(
    private readonly client: HttpClient,
    private readonly destroyRef: DestroyRef,
    private readonly changeDetector: ChangeDetectorRef, // Nécessaire en OnPush
  ) {
    const baseUrl = 'https://dummyjson.com';

    this.searchControl.valueChanges
      .pipe(
        tap(() => {
          this.result = { loaded: false };
        }),
        filter((search) => Boolean(search)),
        debounceTime(300),
        switchMap((search) =>
          this.client.get<UsersResponseDto>(`${baseUrl}/users/search?q=${search}`),
        ),
        map((response) => response.users),
        switchMap((users) => {
          if (users.length > 0) {
            return combineLatest(
              users.map((user) =>
                this.client.get<PostsResponseDto>(`${baseUrl}/posts/user/${user.id}`),
              ),
            );
          }
          return of([]);
        }),
        map((responses) => responses.flatMap((response) => response.posts)),
        map((posts) => {
          return {
            loaded: true,
            posts: posts,
          };
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        this.result = result;
        this.changeDetector.markForCheck(); // Signale à Angular (en OnPush) que notre composant est "dirty"
      });
  }
}
