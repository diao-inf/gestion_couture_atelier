import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Article } from 'src/app/shared/interfaces/article';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent {
  @Input() InputArticle!: Article;
  @Output() editClicked = new EventEmitter<Article>();
  @Output() eventEmiittedDelete = new EventEmitter<Article>();

  buttonText = 'Supprimer';
  showConfirmation = false;
  countdown = 3;



  editer(item: Article){
    this.editClicked.emit(item);
    
  }

  supprimer(item: Article){
    if (this.showConfirmation) {
      // alert("Suppresionn reussi");
      this.eventEmiittedDelete.emit(item)
    } else {
      this.showConfirmation = true;
      this.updateCountdown();

      const countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(countdownInterval);
          this.buttonText = 'Supprimer';
          this.showConfirmation = false;
          this.countdown = 3; // Reset countdown for next click
        } else {
          this.updateCountdown();
        }
      }, 1000);
  }
}

  updateCountdown() {
    this.buttonText = `Confirmer (${this.countdown})`;
  }

  get buttonClass() {
    return {
      'confirmation-active': this.showConfirmation
    };
  }



  getFullImageUrl(relativePath: string): string {
    if (relativePath) {
      return `http://localhost:8000${relativePath}`;
    }
    return '';
  }
  
}

