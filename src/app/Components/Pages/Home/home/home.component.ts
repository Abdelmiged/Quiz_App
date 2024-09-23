import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { QuizDataService } from '../../../../Services/QuizData/quiz-data.service';

interface Difficulty {
  label:string,
  value:string
}

interface Number {
  label:string,
  value:string
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DropdownModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private _Router:Router, private _QuizData:QuizDataService) {}

  difficulties:Difficulty[] = [
    {label:"Easy", value:"easy"},
    {label:"Medium", value:"medium"},
    {label:"Hard", value:"hard"}
  ]

  numberOfQuestions:Number[] = [
    {label:"Small", value:"10"},
    {label:"Medium", value:"20"},
    {label:"Large", value:"30"},
    {label:"Huge", value:"50"}
  ]

  quizForm:FormGroup = new FormGroup({
    difficulty: new FormControl('', Validators.required),
    number: new FormControl(null, Validators.required)
  })

  startQuiz():void {
    if(this.quizForm.valid === true) {
      this._QuizData.getQuestions(this.quizForm.value.number, this.quizForm.value.difficulty).subscribe((res) => {
        this._QuizData.storeQuestions(res);
        this._Router.navigate(["/quiz"]);
      });
    }
  }
}
