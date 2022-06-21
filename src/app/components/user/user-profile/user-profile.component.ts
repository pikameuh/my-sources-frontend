import { Component, OnInit, OnDestroy, LOCALE_ID } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { User } from 'src/app/model/user.interface';
// import { BlogEntriesPageable } from 'src/app/model/blog-entry.interface';
import { BlogService } from 'src/app/services/blog-service/blog.service';
import { PageEvent } from '@angular/material/paginator';
import { Inject } from '@angular/core';
import { JwtPayloadResponse } from 'src/app/interfaces/jwt-payload-response';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { JwtPayload } from 'src/app/interfaces/jwt-payload';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorInterceptor } from 'src/app/interceptors/http-error.interceptor';
import { SnackBarErrorComponent } from '../../error/snackbar-error.component';
import { DateHelper } from 'src/app/common/utils/date-helper';
import { DatePipe, formatPercent } from '@angular/common';


// class ProfileFormData {
//   id: number;
//   pseudo: string;
//   email: string;
//   role_name:  string;
//   role_rank:  number;
//   d_creation:  string;
// }

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: JwtPayload = null;

  percentageLoggedDays : string = "0";
  percentOfDaysActivated : string = "0";
  ratioNumberLoggedDays : number = 0;
  ratioNumberOfDaysActivated : number = 0;
  totalDays : number = 0;

  listUniqueActivationDate : number[] = [];
  nbOfActivatedDays : number = 0;
  nbOfDesactivatedDays : number = 0;

  listUniqueConnectionDateByDay : number[] = [];
  listUniqueConnectionFailedDateByDay : number[] = [];
  listAllConnectionDateByDay : number[] = [];
  listAllConnectionFailedDateByDay : number[] = [];
  nbOfLoggedDays : number = 0;

  listAllLabelsToDisplayInChart: string[] = [];
  listValueForConnectionSucceeded: number[] = [];
  listValueForConnectionFailed: number[] = [];

  


  // private userId$: Observable<number> = this.activatedRoute.params.pipe(
  //   map((params: Params) => parseInt(params['id']))
  // )

  // user$: Observable<JwtPayloadResponse> = this.userId$.pipe(
  //   switchMap((userId: number) => this.userService.findOne(userId))
  // )

  // blogEntries$: Observable<JwtPayloadResponse> = this.userId$.pipe(
  //   switchMap((userId: number) => this.blogService.indexByUser(userId, 1, 10))
  // )

  // updateForm: FormGroup;
  // resendMailForm: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private snackBar: SnackBarErrorComponent,
    public datepipe: DatePipe,

    @Inject(LOCALE_ID) 
    public locale: string,
  ) { }

  ngOnInit(): void {

    this.initDataSource();    
  }

  async initDataSource() {
    console.log(`UserProfileComponent.initDataSource()`);
    // using currentUser ID
    // this.userService.findOne(this.authService.getUserId()).pipe(
    //   map((userData: JwtPayloadResponse) => {
    //     console.log(` + set userData                : ${JSON.stringify(userData)}`);
    //     console.log(` - set dataSource from userData: ${JSON.stringify(userData.data[0])}`);
    //     this.dataSource = userData.data[0];
    //   })
    // ).subscribe();

    const token = await this.authService.getDecodedToken();
    delete token.iat;
    delete token.exp;
    this.user = token ;

    await this.computeDatesForDisplay();

    await this.computeAllLabelsToDisplayInChart();    
    console.log(`listAllLabelsToDisplayInChart: ${this.listAllLabelsToDisplayInChart}`);

    
    
   

    
    
    
    console.log(`datasource initialized: ${JSON.stringify(this.user)}`);

    // this.userService.findOne(parseInt(localStorage.getItem(JWT_ID))).pipe(
    //   map((userData: JwtPayloadResponse) => {
    //     console.log(`set dataSource from userData: ${JSON.stringify(userData)}`);
    //     this.dataSource = userData;
    //   })
    //   //this.dataSource = userData) // console.log(`userData: ${JSON.stringify(userData)}`))//, 
    // ).subscribe();

    // --- form controls
    // this.updateForm = this.formBuilder.group({
    //   id: [null, [Validators.required]],
    //   pseudo: [null, [Validators.required]],
    //   email: [null, [
    //     Validators.required,
    //     Validators.email,
    //     Validators.minLength(6)
    //   ]],
    //   d_creation: [null, [Validators.required]],
    //   role: [null, [Validators.required]],
    // })

    // this.updateForm.setValue(this.dataSource);

    // console.log(`UsersComponent.initDataSource() end > ${this.updateForm.get('role_rank')}`);
  }

  async computeDatesForDisplay() {

    // Build temp array already formatted (to compare)
    var tmpListParsedActivationDate : number[] = [];
    await this.user.date_manager.d_activations.forEach(connection => {
      tmpListParsedActivationDate.push(DateHelper.parseDateFromDbToNumber(connection));
    });


    await tmpListParsedActivationDate.forEach(currentActivationDate => {
      // add date only if it does not already exists in the resul list
      if ( !this.listUniqueActivationDate.includes(currentActivationDate)) {
        // and if it exists an even number of recurence in the list ( e.g: don't count when activate + desactivated the same day)
        if ( (tmpListParsedActivationDate.filter( date => date === currentActivationDate).length % 2 ) === 1){
          this.listUniqueActivationDate.push(currentActivationDate);
        }
      }
    });

    await this.user.date_manager.d_connections_succeeded.forEach(connection => {
      const nConnectionDate = DateHelper.parseDateFromDbToNumber(connection);
      if ( !this.listUniqueConnectionDateByDay.includes(nConnectionDate)) {
          this.listUniqueConnectionDateByDay.push(nConnectionDate);    
          this.nbOfLoggedDays++;    
      }

      this.listAllConnectionDateByDay.push(nConnectionDate);
    });
    console.log(` --- this.nbOfLoggedDays: ${this.nbOfLoggedDays}`);

    await this.user.date_manager.d_connections_failed.forEach(connection => {
      const nConnectionDate = DateHelper.parseDateFromDbToNumber(connection);
      if ( !this.listUniqueConnectionFailedDateByDay.includes(nConnectionDate)) {
          this.listUniqueConnectionFailedDateByDay.push(nConnectionDate);  
      }
            
      this.listAllConnectionFailedDateByDay.push(nConnectionDate);
    });
    console.log(` --- nbOfFailedConnections: ${this.listAllConnectionFailedDateByDay.length}`);

    await this.computePercentOfDaysActivated();
    this.totalDays = this.nbOfActivatedDays + this.nbOfDesactivatedDays;

    this.computePercentageOfLoggedDays();

    
  }

  onPaginateChange(event: PageEvent) {
    // return this.userId$.pipe(
    //   tap((userId: number) => this.blogEntries$ = this.blogService.indexByUser(userId, event.pageIndex, event.pageSize))
    // ).subscribe();
  }

  // isFormValid() {

  //   if ( ! this.updateForm) {
  //     return false;
  //   }

  //   if (this.updateForm.invalid) {
  //     return false;
  //   }

  //   return true;
  // }


  onSubmit() {
    // if (this.updateForm.invalid) {
    //   // this.snackBar.openSnackBar(`Data invalid`,'Close','green-snackbar');
    //   console.log('invalide!!!!!!!!!!!!!!!!!!!!!!!!');
    //   return;
    // } 
    // console.log('Everything seems ok xD');

    // this.snackBar.openSnackBar(`Everything seems ok xD`,'Close','green-snackbar');
    // delete this.registerForm.value.confirmPassword;
    // console.log(this.registerForm.value);
    // this.authService.register(this.registerForm.value).pipe(
    //   map(user => this.router.navigate(['login']))
    // ).subscribe()
  }

  getLastConnection() {
    const connections : Date[]= this.user.date_manager.d_connections_succeeded;
    return connections[connections.length - 1];
  }

  computePercentageOfLoggedDays(){
    console.log(`getPercentageOfLoggedDays  ( ${this.nbOfLoggedDays} / ( ${this.totalDays})) * 100`);
    this.percentageLoggedDays = this.formatPercent(( this.nbOfLoggedDays / (this.totalDays )) ) ;
    this.ratioNumberLoggedDays = this.getNumberValueOfPercentageOf(this.percentageLoggedDays);
  }

  // getNumberValueOfPercentageOfLoggedDays(){
  //   return this.getNumberValueOfPercentageOf(this.percentageLoggedDays);
  // }

  // getNumberValueOfPercentageOfActivatedDays(){
  //   return this.getNumberValueOfPercentageOf(this.percentOfDaysActivated);
  // }

  getNumberValueOfPercentageOf(valueToParse: string){
    console.log (` - - - - >valueToParse :  ${valueToParse} ---> tot = ${this.nbOfActivatedDays + this.nbOfDesactivatedDays}`)
    const value = parseInt(valueToParse.substring(0, valueToParse.length -1));
    console.log(` 123456789 --> value ${value}`);
    return value;
  }

  getNumberOfDaysLogged() {
    return this.listUniqueConnectionDateByDay.length;
  }

  computePercentOfDaysActivated() {

    console.log(` +++++++++++++++++++> getPercentOfDaysActivated ${this.listUniqueActivationDate.length}`);

    const nbActivations = this.listUniqueActivationDate.length;
    if (nbActivations > 0) {
      // Retrieve creation date
      const nCreationDate = DateHelper.parseDateFromDbToNumber(this.user.date_manager.d_creation);
      let lastDate = this.listUniqueActivationDate[0];
      let nbActivatedDays : number = 0;
      let nbDesctivatedDays : number = 0;
      let currentStateComputationIsActivated : boolean = true;

     

      // Calculate time creation <--> first activation if not activated the first day
      const diffInDaysCreationFirstConnection = 0;
      if (nCreationDate)
      DateHelper.getDifferenceInDays(nCreationDate, lastDate) ; 
      console.log(` <> > > > > > nCreationDate ${nCreationDate} - lastDate ${lastDate} -> diffInDaysCreationFirstConnection= ${diffInDaysCreationFirstConnection}`);
      // if (lastDate - nCreationDate != 0) {
        nbDesctivatedDays += (diffInDaysCreationFirstConnection > 0)? diffInDaysCreationFirstConnection : 0;
      // }

      // Add days 

      // For every activation
      for (let i = 1; i < nbActivations; i++) {
        // console.log(`======== LOOP FOR i ${i} / ${ nbActivations - 1}`);

        const currentActivationDate = this.listUniqueActivationDate[i];  
        const diffInDaysCurrentLast = DateHelper.getDifferenceInDays(currentActivationDate, lastDate) ;   
        // console.log(` i = ${i} -> diffInDaysCurrentLast= ${diffInDaysCurrentLast} > currentActivationDate  = ${currentActivationDate} ; lastDate  = ${lastDate}`);

        if (currentStateComputationIsActivated) {
          nbActivatedDays += (diffInDaysCurrentLast > 0)? diffInDaysCurrentLast: 0;
        } else {
          nbDesctivatedDays += (diffInDaysCurrentLast > 0)? diffInDaysCurrentLast: 0;
        }

        // console.log(` i = ${i} > nbActivatedDays  = ${nbActivatedDays} ; nbDesctivatedDays  = ${nbDesctivatedDays}`);
        // console.log(`currentActivationDate ${currentActivationDate} / lastDate ${lastDate} `);

        lastDate = currentActivationDate;
        currentStateComputationIsActivated = !currentStateComputationIsActivated;
      }

      // Add between last connection and today
      const diffInDaysLastNow = DateHelper.getDifferenceInDays(lastDate, Date.now()) ;        
      if (currentStateComputationIsActivated) {
        nbActivatedDays += (diffInDaysLastNow > 0)? diffInDaysLastNow: 0;
      } else {
        nbDesctivatedDays += (diffInDaysLastNow > 0)? diffInDaysLastNow: 0;
      }

      this.nbOfActivatedDays = nbActivatedDays;
      this.nbOfDesactivatedDays = nbDesctivatedDays;

      // console.log(` ${nbActivatedDays} days activated and ${nbDesctivatedDays} days desactivated `);
      this.percentOfDaysActivated =  this.formatPercent((nbActivatedDays / (nbActivatedDays + nbDesctivatedDays))) ;

      // console.log(`^^^^^^ this.percentOfDaysActivated =  this.formatPercent((${nbActivatedDays} / (${nbActivatedDays} + ${nbDesctivatedDays}))) ;  => ${this.percentOfDaysActivated}`)
    } else {
      this.percentOfDaysActivated = this.formatPercent(0);
    }

    this.ratioNumberOfDaysActivated= this.getNumberValueOfPercentageOf(this.percentOfDaysActivated); 
    
  }


  formatPercent(value: number) {
    return formatPercent( value, this.locale, '2.0-1') ;
  }

  async computeAllLabelsToDisplayInChart(){

    if (this.user?.date_manager?.d_connections_succeeded.length > 0 ){

       // Compute stats connection succeeded / failed
       this.listValueForConnectionSucceeded = [];
       this.listValueForConnectionFailed = [];

      const start = DateHelper.parseDateFromDbToNumber(this.user.date_manager.d_creation);
      const end = DateHelper.parseDateFromDbToNumber(this.user.date_manager.d_connections_succeeded[ this.user.date_manager.d_connections_succeeded.length - 1]);
      // double-line.chart_label
      const listDates = DateHelper.getNumberListOfDaysBetweenDates_Inclusive(start, end);
    
      var listFormatedDates: string[] = [];
      await listDates.forEach( date => {
        listFormatedDates.push(this.datepipe.transform(date, 'dd/MM/yyyy'));

        // console.log(` <> date: ${date} > ${this.listAllConnectionDateByDay[0]}`);

        this.listValueForConnectionSucceeded.push(this.listAllConnectionDateByDay.filter( d => d === date).length);

        // BUG : Divide by 2 bcs of a backend bug, trying to log twice and store 2 failed activities 'at once'
        this.listValueForConnectionFailed.push(this.listAllConnectionFailedDateByDay.filter( d => d ===  date).length / 2);
      });
      
      // console.log(`listFormatedDates: ${listFormatedDates} > ${listDates.length}`);
      // console.log(` --- listValueForConnectionSucceeded: ${this.listValueForConnectionSucceeded}`);

     



      this.listAllLabelsToDisplayInChart =  listFormatedDates;
    }

    // this.listAllLabelsToDisplayInChart =  ['Nan'];
    
  }
}

// this.userService.findAll(1, 10).pipe(
//   map((userData: JwtPayloadResponse) => {
//     console.log(`set dataSource from userData: ${JSON.stringify(userData)}`);
//     this.dataSource = userData;
//   })
//   //this.dataSource = userData) // console.log(`userData: ${JSON.stringify(userData)}`))//,
// ).subscribe();
