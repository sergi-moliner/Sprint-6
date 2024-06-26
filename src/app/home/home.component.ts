import { Component, OnInit } from '@angular/core';
import { WelcomeComponent } from '../welcome/welcome.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { PanelComponent } from '../panel/panel.component';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../services/budget.service';
import { BudgetListComponent } from '../budget-list/budget-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [WelcomeComponent, ReactiveFormsModule, PanelComponent, CommonModule, BudgetListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  form: FormGroup;
  totalBudget = 0;
  priceSeo = 300;
  priceAds = 400;
  priceWeb = 500;

  ngOnInit() {
    document.getElementById('panel')!.style.display = 'none';
  }

  constructor(private fb: FormBuilder, private budgetService: BudgetService) {
    this.form = this.fb.group({
      seo: [false],
      ads: [false],
      web: [false]
    });
    this.form.get('seo')!.valueChanges.subscribe(checked => {
      this.totalBudget += checked ? this.priceSeo : -this.priceSeo;
      this.budgetService.setBudget(this.totalBudget);
    });
    this.form.get('ads')!.valueChanges.subscribe(checked => {
      this.totalBudget += checked ? this.priceAds : -this.priceAds;
      this.budgetService.setBudget(this.totalBudget);
    });
    this.form.get('web')!.valueChanges.subscribe(checked => {
      const webDiv = document.getElementById('webDiv');
      this.totalBudget += checked ? this.priceWeb : -this.priceWeb;
      this.budgetService.setBudget(this.totalBudget);
      if (checked) {
        document.getElementById('panel')!.style.display = 'block';
        webDiv?.classList.add('border-green');
      } else {
        this.budgetService.checkboxChanged.next(checked);
        document.getElementById('panel')!.style.display = 'none';
        webDiv?.classList.remove('border-green');
      }
    });


    this.budgetService.totalBudgetSubject.subscribe((total: number) => {
      this.totalBudget = total;
    });
  }
}
