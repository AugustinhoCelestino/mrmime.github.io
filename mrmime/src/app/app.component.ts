import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { text } from 'stream/consumers';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  daySize: number = 22;
  days: any[] = [];
  hoursMouth: number = 0;
  hoursMouthMax: number = 0;
  firstWeekDays: number = 5;

  generateDays() {
    this.days.length = 0;
    this.hoursMouthMax = this.daySize * 8 * 60;
    for (let i = 0; i < this.daySize; i++) {
      this.days.push(this.generateRandomEntry());
    }
    this.calcHourMouth();
    if (this.hoursMouth > this.hoursMouthMax) {
      this.generateDays();
    }
    this.ajustHourToFix();
    this.copyToClipboard();
  }

  generateRandomEntry(): any {
    let randomEntries = [
      this.randomIntFromInterval(480, 599),
      this.randomIntFromInterval(720, 780),
      this.randomIntFromInterval(821, 830),
      this.randomIntFromInterval(1050, 1140),
    ];

    let entry = {
      values: randomEntries,
      totalHours: this.generateWorkedHour(randomEntries),
    };
    return entry;
  }

  randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  convertNumberToHour(_number: number): string {
    let hour = Math.floor(_number / 60);
    let mim = _number % 60;
    return hour + ':' + (mim < 10 ? '0' + mim : mim);
  }

  generateWorkedHour(_entry: number[]): number {
    let hours = _entry[1] - _entry[0] + (_entry[3] - _entry[2]);
    return hours;
  }

  calcHourMouth(): void {
    this.hoursMouth = 0;
    this.days.forEach((day) => {
      this.hoursMouth += day.totalHours;
    });
  }

  ajustHourToFix(): void {
    while (this.hoursMouth < this.hoursMouthMax) {
      let tmp = this.days.map((day) => day.totalHours);
      let minvalue = Math.min.apply(Math, tmp);
      let index = tmp.indexOf(minvalue);
      let rnd = this.randomIntFromInterval(0, 3);

      rnd % 2
        ? (this.days[index].values[rnd] =
            this.days[index].values[rnd] + this.randomIntFromInterval(1, 3))
        : (this.days[index].values[rnd] =
            this.days[index].values[rnd] - this.randomIntFromInterval(1, 3));

      this.days[index].totalHours = this.generateWorkedHour(
        this.days[index].values
      );

      this.calcHourMouth();
    }
  }

  copyToClipboard() {
    let textToClip = '';
    let breakline = `
  `;
    let weekDay = this.firstWeekDays;
    this.days.forEach((day) => {
      textToClip +=
        this.convertNumberToHour(day.values[0]) +
        '	' +
        this.convertNumberToHour(day.values[1]) +
        '	' +
        this.convertNumberToHour(day.values[2]) +
        '	' +
        this.convertNumberToHour(day.values[3]) +
        breakline;

      weekDay--;

      if (weekDay <= 0) {
        weekDay = 5;
        textToClip += breakline + breakline;
      }
    });
    navigator.clipboard.writeText(textToClip);
  }
}
