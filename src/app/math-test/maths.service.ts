import { Injectable, OnDestroy } from '@angular/core';

import { Observable, of } from 'rxjs';
import { delay }      from 'rxjs/operators';

export class MathQuestion {

  constructor(public operator:string="+", public maxNumberTop:number = 99, public maxNumberBottom:number=10, public numberTop:number=NaN, public numberBottom:number=NaN){
    let numbers = [Math.floor(Math.random()*maxNumberTop),Math.floor(Math.random()*maxNumberBottom)]
    this.numberTop = numberTop?numberTop:Math.max.apply(Math,numbers) // largest number on top
    this.numberBottom = numberBottom?numberBottom:Math.min.apply(Math,numbers) // largest number on bottom
    this.operator = operator
    switch(operator){
      case "+":
        this.correctSolution = eval(this.numberTop+operator+this.numberBottom);
        break;
      case "x":
        this.correctSolution = eval(this.numberTop+"*"+this.numberBottom);
        break;
    }
    this.answeredCorrectly = false;
    this.answered=false;
  }

  public numberTop:number
  public numberBottom:number
  public correctSolution:number
  public answered:boolean
  public answeredCorrectly:boolean

  // test for correctness
  public answerQuestion(answer:number){
    this.answeredCorrectly = (answer === this.correctSolution);
    this.answered = true;
    return this.answeredCorrectly;
  }

}

export class MathTest {
  constructor(public secondsTotal: number, public title:string, public operator:string="+",public maxTopNumber:number=99, public maxBottomNumber:number=10,public numberTop:number=NaN, public numberBottom:number=NaN) { 
    this.secondsRemaining = secondsTotal;
    this.questionsTotal=0;
    this.questionsCorrect=0;
    this.questionsIncorrect=0;
    this.maxTopNumber = maxTopNumber;
    this.maxBottomNumber = maxBottomNumber;

    this.operator = operator;
    this.isRunning = false;
  }
  
  public secondsRemaining:number
  public questionsTotal:number
  public questionsCorrect:number
  public questionsIncorrect:number
  public isRunning:boolean


  public currentQuestion:MathQuestion

  private interval

  public start(){
    this.nextQuestion()
    this.isRunning = true
    this.interval = setInterval(()=>{
      if(this.isRunning){
        this.secondsRemaining--
        if(this.secondsRemaining === 0){
          this.isRunning=false;
          clearInterval(this.interval)
        }
      }
    },1000)
  }

  public clone(){
    return new MathTest(this.secondsTotal,this.title,this.operator,this.maxTopNumber, this.maxBottomNumber,this.numberTop)
  }

  public stop(){
    this.isRunning=false;
  }

  public nextQuestion(){
    this.currentQuestion = new MathQuestion(this.operator,this.maxTopNumber,this.maxBottomNumber,this.numberTop, this.numberBottom);
  }

  public answerCurrentQuestion(answer:number){
    let correct = this.currentQuestion.answerQuestion(answer)
    if(correct){
      this.questionsCorrect++
    }else{
      this.questionsIncorrect++
    }
  }
}

const MATH_TESTS: MathTest[] = [
  new MathTest(60, 'Math Facts (3s)','x',3,10,3),
  new MathTest(60, 'Math Facts (4s)','x',4,10,4),
  new MathTest(60, 'Math Facts (5s)','x',5,10,5),
  new MathTest(60, 'Math Facts (6s)','x',6,10,6),
  new MathTest(60, 'Math Facts (7s)','x',7,10,7),
  new MathTest(60, 'Math Facts (8s)','x',8,10,8),
  new MathTest(60, 'Math Facts (9s)','x',9,10,9),
  new MathTest(60, 'Math Facts (10s)','x',10,10,10),
  new MathTest(60, 'Math Facts (all)','x',10,10),
  // new MathTest(30, '30 Seconds'),
  // new MathTest(60, '1 Minute'),
  // new MathTest(300, '5 Minutes'),
];

const FETCH_LATENCY = 500;

/** Simulate a data service that retrieves heroes from a server */
@Injectable()
export class MathsService implements OnDestroy {

  constructor() { console.log('MathTestService instance created.'); }
  ngOnDestroy() { console.log('MathTestService instance destroyed.'); }

  public tests:MathTest[] = MATH_TESTS

  getMathTests(): Observable<MathTest[]>  {
    return of(MATH_TESTS).pipe(delay(FETCH_LATENCY));
  }

  getMathTest(id: number | string): Observable<MathTest> {
    const mathTest$ = of(MATH_TESTS.find(()=>true));
    return mathTest$.pipe(delay(FETCH_LATENCY));
  }
}

