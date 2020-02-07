import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Meal } from '../models/meal';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MealsListService {
  testEndpoint = 'http://localhost:5000/';
  meals = [];
  mealsSubject: BehaviorSubject<Meal[]>;
  mealsList$: Observable<Meal[]>;

  constructor(private http: HttpClient) {
    this.mealsSubject = new BehaviorSubject([]);
    this.mealsList$ = this.mealsSubject.asObservable();
  }

  getMeals(): Observable<{ meals: Meal[] }> {
    const url = this.testEndpoint + 'meals';
    return this.http.get(url).pipe(
      tap((data: { meals: Meal[] }) => {
        this.meals = data.meals;
        this.mealsSubject.next(this.meals);
      })
    );
  }

  addMeal(newMeal) {
    const url = this.testEndpoint + 'meals';

    const formData = new FormData();
    formData.append('image', newMeal.image, newMeal.image.name);
    formData.append('name', newMeal.name);
    formData.append('desc', newMeal.desc);

    this.http.post(url, formData).subscribe(
      () => {
        this.meals.push(newMeal);
        this.mealsSubject.next(this.meals);
      },
      err => {
        console.log(err);
      }
    );
  }

  deleteMeal(mealId) {
    this.http.delete(`${this.testEndpoint}meals/${mealId}`).subscribe(
      () => {
        console.log('Meal deleated');
      },
      err => {
        console.log(err);
      }
    );
  }
}
