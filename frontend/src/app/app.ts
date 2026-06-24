import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Sidebar } from './shared/components/sidebar/sidebar';
import { appRoutes } from './app.routes';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private router = inject(Router);
  private publicPaths = [`/${appRoutes.public.login}`, `/${appRoutes.public.register}`];

  isPublicRoute = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.publicPaths.some((path) => this.router.url.startsWith(path))),
      startWith(this.publicPaths.some((path) => this.router.url.startsWith(path))),
    ),
  );
}
