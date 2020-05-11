import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import { DalService } from 'src/app/services/dal.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // chart options
  chartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,

        }
      }]
    }
  };

  chartType = "bar";
  chartLegend = true;
  //chart colors
  chartColors = [
    { // first color
      backgroundColor: 'rgba(50, 59, 204, 0.86)',
      borderColor: 'rgba(225,10,24,0.2)',
      pointBackgroundColor: 'rgba(225,10,24,0.2)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(225,10,24,0.2)'
    },
    { // second color
      backgroundColor: 'rgba(211, 52, 71, 0.86)',
      borderColor: 'rgba(211, 52, 71, 0.86)',
      pointBackgroundColor: 'rgba(225,10,24,0.2)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(225,10,24,0.2)'
    },

    { // third color
      backgroundColor: 'rgba(23, 162, 184, 1)',
      borderColor: 'rgba(211, 52, 71, 0.86)',
      pointBackgroundColor: 'rgba(225,10,24,0.2)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(225,10,24,0.2)'
    },
    { // fourth color
      backgroundColor: 'rgba(255, 226, 154, 1)',
      borderColor: 'rgba(rgba(255, 226, 154, 1)',
      pointBackgroundColor: 'rgba(225,10,24,0.2)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(225,10,24,0.2)'
    }
  ];

  //chart lable
  chartLabels = ['Overall Test summary'];
  initialState: any;
  onChartClick: any;
  
  constructor(public dal: DalService) { }

  ngOnInit() {
    this.getCcMetaData();
    this.getAllStudents();
    $(document).ready(function () {

      $(function () {

        'use strict';

        (function () {

          var aside = $('.side-nav'),

            showAsideBtn = $('.show-side-btn'),

            contents = $('#contents');

          showAsideBtn.on("click", function () {

            $("#" + $(this).data('show')).toggleClass('show-side-nav');

            contents.toggleClass('margin');

          });

          if ($(window).width() <= 767) {

            aside.addClass('show-side-nav');

          }
          $(window).on('resize', function () {

            if ($(window).width() > 767) {

              aside.removeClass('show-side-nav');

            }

          });

          // dropdown menu in the side nav
          var slideNavDropdown = $('.side-nav-dropdown');

          $('.side-nav .categories li').on('click', function () {

            $(this).toggleClass('opend').siblings().removeClass('opend');

            if ($(this).hasClass('opend')) {

              $(this).find('.side-nav-dropdown').slideToggle('fast');

              $(this).siblings().find('.side-nav-dropdown').slideUp('fast');

            } else {

              $(this).find('.side-nav-dropdown').slideUp('fast');

            }

          });

          $('.side-nav .close-aside').on('click', function () {

            $('#' + $(this).data('close')).addClass('show-side-nav');

            contents.removeClass('margin');

          });



        })
      });

    })
  }


  allStudents: any = null;
  metaData: any;
  // for getting meta data for cc
  getCcMetaData() {
    this.dal.getCCMetaData(parseInt(localStorage.getItem('userId'))).subscribe(x => {
      this.metaData = x;
      ////console.log("cc meta data in home", x);
      this.chartData = [
        { data: [this.metaData && this.metaData.noOfQuestions || 0], label: 'Questions' },
        { data: [this.metaData && this.metaData.noOfQuestionPapers || 0], label: 'Question Papers' },
        { data: [this.allStudents && this.allStudents.studentInformation && this.allStudents.studentInformation.length || 0], label: 'students' },
        { data: [this.metaData && this.metaData.subjectInfo.length || 0], label: "Subjects" }
      ]
    })
  }

  //initial chart data
  chartData = [
    { data: [0], label: 'Questions' },
    { data: [0], label: 'Question Papers' },
    { data: [0], label: 'students' },
    { data: [0], label: "Subjects" }
  ]

  // get all students in cc
  getAllStudents() {
    this.dal.getAllStudentsByCcId(parseInt(localStorage.getItem('userId'))).subscribe(x => {
      this.allStudents = x;
      this.chartData = [
        { data: [this.metaData && this.metaData.noOfQuestions || 0], label: 'Questions' },
        { data: [this.metaData && this.metaData.noOfQuestionPapers || 0], label: 'Question Papers' },
        { data: [this.allStudents.studentInformation && this.allStudents.studentInformation.length || 0], label: 'students' },
        { data: [this.metaData && this.metaData.subjectInfo.length || 0], label: "Subjects" }
      ]
      ////console.log("all students", x)
    })
  }

}
