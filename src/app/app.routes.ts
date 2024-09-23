import { Routes } from '@angular/router';
import { HomeComponent } from './Components/Pages/Home/home/home.component';
import { NotFoundComponent } from './Components/Pages/NotFound/not-found/not-found.component';
import { QuizComponent } from './Components/Pages/Quiz/quiz/quiz.component';

export const routes: Routes = [
    {path: "home", component: HomeComponent},
    {path: "quiz", component: QuizComponent},
    {path: "", redirectTo: "home", pathMatch: "full"},
    {path: "**", component: NotFoundComponent},
];
