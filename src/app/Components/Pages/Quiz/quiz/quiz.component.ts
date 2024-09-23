import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Question } from '../../../../Interfaces/questions';
import { QuizDataService } from '../../../../Services/QuizData/quiz-data.service';
import { FilterStringPipe } from '../../../../Pipes/filter-string.pipe';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [RouterLink, FilterStringPipe, ReactiveFormsModule, NgClass],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent implements OnInit, AfterViewInit{
  question!:Question;
  answers!:string[];
  timer!:HTMLElement;
  timeRegex:RegExp = /[0-9]*/g;
  time:number = 60;
  intervalID!:NodeJS.Timeout;
  score:number = 0;
  answersForm:FormGroup = new FormGroup({
    answer: new FormControl({value: '', disabled:false}, Validators.required)
  })

  constructor(protected _QuizData:QuizDataService, @Inject(PLATFORM_ID) private platform_id:Object){}

  ngOnInit(): void {
      this.generateQuestion();
  }

  ngAfterViewInit():void {
    if(isPlatformBrowser(this.platform_id)) {
      this.timer = document.querySelector(".timer")!;
      this.timer.style.setProperty("--time", "0deg");
      this.time = 60;
    }
  }

  generateQuestion():void {
    this.intervalID = setInterval(() => this.questionTimer(), 1000);
    this.question = this._QuizData.questions.results[this._QuizData.currentQuestion.getValue()];
    this.answers = [];
    this.answers.push(this.question.correct_answer);
    this.answers.push(...this.question.incorrect_answers);
    this.shuffleAnswers();
  }

  shuffleAnswers():void {
    let currentIndex = this.answers.length;

    while(currentIndex !== 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [this.answers[currentIndex], this.answers[randomIndex]] = [this.answers[randomIndex], this.answers[currentIndex]];
    }
  }

  choseAnswer($event:Event):void {
    this.answersForm.controls['answer'].disable();
    let input = ($event.currentTarget as HTMLElement);
    let parent = input.parentElement;
    clearInterval(this.intervalID);

    if(input.getAttribute("ng-reflect-value") === this.question.correct_answer) {
      parent?.classList.add("!bg-[#ABD1C6]");
      console.log("correct");
      this.score++;
    }
    else {
      parent?.classList.add("!bg-[#d1abab]");
      console.log("wrong");
    }
  }

  nextQuestion():void {
    if(this._QuizData.currentQuestion.getValue() !== this._QuizData.questions.results.length)
      this._QuizData.currentQuestion.next(this._QuizData.currentQuestion.getValue() + 1);
    
    if(this._QuizData.currentQuestion.getValue() === this._QuizData.questions.results.length){
      this.answersForm.reset();
      this.answersForm.controls['answer'].disable();
      clearInterval(this.intervalID);
      return;
    }
    this.generateQuestion();
    this.reset();
  }

  reset():void {
    this.timer.style.setProperty("--time", "0deg");
    this.time = 60;
    this.answersForm.controls['answer'].enable();
    this.answersForm.controls['answer'].reset();
    document.querySelectorAll('div:has( > input)').forEach((item) => {
      item.classList.remove("!bg-[#ABD1C6]", "!bg-[#d1abab]");
    })
  }

  questionTimer():void {
    if(isPlatformBrowser(this.platform_id)) {
      let time = this.timer.style.getPropertyValue("--time");
      time = time.match(this.timeRegex)![0];
      time = (parseInt(time) + 6).toString();
      this.timer.style.setProperty("--time", time+"deg")
      this.time--;
  
      if(this.time === 0 || this.timer.style.getPropertyValue("--time").match(this.timeRegex)![0] === "360") {
        document.querySelectorAll('div input').forEach((item) => {
          if(item.getAttribute('ng-reflect-value') === this.question.correct_answer) {
            (item as HTMLElement).click();
          }
        })
        clearInterval(this.intervalID);
      }
    }
  }
}