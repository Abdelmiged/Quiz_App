import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result } from '../../Interfaces/questions';
import { Environment } from '../../Environment/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizDataService {
  currentQuestion:BehaviorSubject<number> = new BehaviorSubject<number>(0);
  questions!:Result;

  constructor(private _HTTPClient:HttpClient) { }

  getQuestions(number:string, difficulty:string):Observable<Result> {
    this.currentQuestion.next(0);
    return this._HTTPClient.get<Result>(`${Environment.BaseURL}?amount=${number}&difficulty=${difficulty}&type=multiple`);
  }

  storeQuestions(result:Result):void {
    this.questions = result;
  }
}