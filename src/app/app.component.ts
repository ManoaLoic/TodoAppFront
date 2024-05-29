import { Router, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';

import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AssignmentsComponent } from './assignments/assignments.component';
import { AuthService } from './shared/auth.service';
import { AssignmentsService } from './shared/assignments.service';
import { MatieresService } from './shared/matieres.service';
import { UsersService } from './shared/users.service';
import { Observable, forkJoin, lastValueFrom } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { User } from './users/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FULL_PAGE } from './shared/constants';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Assignment } from './assignments/assignment.model';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AssignmentMarkNoteComponent } from './assignments/assignment-mark-note/assignment-mark-note.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink, MatButtonModule, MatDividerModule, RouterLinkActive, DragDropModule,
        MatIconModule, MatSlideToggleModule,
        AssignmentsComponent,
        MatSidenavModule, MatButtonModule, MatCheckboxModule, MatSidenavModule, MatToolbarModule, MatListModule, CommonModule, FormsModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'Assignments Application';
    opened: boolean = true;
    profileOpened: boolean = false;
    userConnected: User;
    isFullPage: boolean = false;
    targetList: string = '/done';

    constructor(private authService: AuthService,
        private assignmentsService: AssignmentsService,
        private matieresService: MatieresService,
        private usersService: UsersService,
        private router: Router,
        private dialog: MatDialog) {
        this.userConnected = new User();
        this.userConnected.nom = 'Lezley Lambrook';
        this.userConnected.email = 'llambrook1@blogger.com';
        this.userConnected.isAdmin = true;
    }

    isLogged() {
        if (this.authService.loggedIn) {
        }
        return this.authService.loggedIn;
    }

    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.isFullPage = FULL_PAGE.includes(event.url);
            }
        });
    }

    openModal() {
        const dialogRef = this.dialog.open(AssignmentMarkNoteComponent, {
            width: '400px', // Adjust width as needed
            data: {} // You can pass data to the modal if needed
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // Do something with the result if needed
        });
    }

    drop(event: CdkDragDrop<string[]>) {
        console.log('Data', event.item.data);
        this.openModal();
    }

    toggleNavBar() {
        this.opened = !this.opened;
    }

    toggleProfile() {
        this.profileOpened = !this.profileOpened;
    }

    login() {
        // on utilise le service d'autentification
        // pour se connecter ou se déconnecter
        if (!this.authService.loggedIn) {
            this.router.navigate(['/login']);
        } else {
            this.authService.logOut();
            // on navigue vers la page d'accueil
            this.router.navigate(['/home']);
        }
    }

    async genererDonneesDeTest() {
        await this.insertMatiereAndUser();
        const users = await lastValueFrom(this.usersService.getUsersPagines(1, 1000));
        const matieres = await lastValueFrom(this.matieresService.getMatieresPagines(1, 1000));
        this.assignmentsService.peuplerBDavecForkJoin(users.docs, matieres.docs)
            .subscribe(() => {
                console.log("Données générées, on rafraichit la page pour voir la liste à jour !");
                window.location.reload();
            });
    }

    private insertMatiereAndUser(): Promise<any> {
        let inserts: Observable<any>[] = [];
        inserts.push(this.matieresService.peuplerBDavecForkJoin());
        inserts.push(this.usersService.peuplerBDavecForkJoin());
        return lastValueFrom(forkJoin(inserts));
    }

}
