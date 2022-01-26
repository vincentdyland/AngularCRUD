import { ApiService } from './../shared/api.service';
import { EmployeeModel } from './employee-dashboard.model';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss'],
})
export class EmployeeDashboardComponent implements OnInit {
  formValue!: FormGroup;
  EmployeeModelObj: EmployeeModel = new EmployeeModel();
  EmployeeData!: any;
  showAdd!: boolean;
  showUpdate!: boolean;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.formValue = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9 ]{10}'),
      ]),
      salary: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9 ]{4}'),
      ]),
    });

    this.getAllEmployee();
  }
  get email() {
    return this.formValue.get('email');
  }
  get mobile() {
    return this.formValue.get('mobile');
  }
  get salary() {
    return this.formValue.get('salary');
  }

  public clickAddEmployee() {
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }
  public postEmployeeDetails() {
    this.EmployeeModelObj.firstName = this.formValue.value.firstName;
    this.EmployeeModelObj.lastName = this.formValue.value.lastName;
    this.EmployeeModelObj.email = this.formValue.value.email;
    this.EmployeeModelObj.mobile = this.formValue.value.mobile;
    this.EmployeeModelObj.salary = this.formValue.value.salary;

    this.api.postEmployee(this.EmployeeModelObj).subscribe(
      (res) => {
        console.log(res);
        alert('Employee Added Successfully');
        let ref = document.getElementById('cancel');
        ref?.click();
        this.formValue.reset();
        this.getAllEmployee();
      },
      (err) => {
        alert('Something went wrong');
      }
    );
  }

  public getAllEmployee() {
    this.api.getEmployee().subscribe((res) => {
      this.EmployeeData = res;
    });
  }

  public deleteEmployee(row: any) {
    this.api.deleteEmployee(row.id).subscribe((res) => {
      alert('Employee Deleted');
      this.getAllEmployee();
    });
  }

  public onEdit(row: any) {
    this.showAdd = false;
    this.showUpdate = true;
    this.EmployeeModelObj.id = row.id;
    
    this.formValue.controls['firstName'].setValue(row.firstName);
    this.formValue.controls['lastName'].setValue(row.lastName);
    this.formValue.controls['email'].setValue(row.email);
    this.formValue.controls['mobile'].setValue(row.mobile);
    this.formValue.controls['salary'].setValue(row.salary);
  }

  public updateEmployeeDetails() {
    this.EmployeeModelObj.firstName = this.formValue.value.firstName;
    this.EmployeeModelObj.lastName = this.formValue.value.lastName;
    this.EmployeeModelObj.email = this.formValue.value.email;
    this.EmployeeModelObj.mobile = this.formValue.value.mobile;
    this.EmployeeModelObj.salary = this.formValue.value.salary;
    this.api
      .updateEmployee(this.EmployeeModelObj, this.EmployeeModelObj.id)
      .subscribe((res) => {
        alert('Updated Successfully');
        let ref = document.getElementById('cancel');
        ref?.click();
        this.formValue.reset();
        this.getAllEmployee();
      });
  }
}
