import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Meal } from '../models/meal';

@Injectable({
  providedIn: 'root',
})
export class MealsListService {
  meals = [];
  mealsSubject: BehaviorSubject<Meal[]>;

  constructor(private http: HttpClient) {
    this.mealsSubject = new BehaviorSubject([]);
  }

  getMeals(): void {
    const url = environment.ENDPOINT + 'meals';
    this.http.get(url).subscribe((data: { meals: Meal[] }) => {
      this.meals = data.meals;
      this.mealsSubject.next(this.meals);
    });
  }
}
