angular
  .module('myApp')
  .controller('authorityController', function($scope, $http,$window) {
    $scope.prescriptions=[];
    var data = JSON.stringify({
      reportQuery: {
        patient_name: $scope.patientName || '',
        prescription_id: $scope.prescriptionId || '',
        pharmacy_name: $scope.pharmacyName || '',
        doctor_name: $scope.providerName || '',
      },
    });
    $('#exampleModalCenterError').modal('show'); 
    $http({
      method: 'get',
      url: '/get-all',
      data: data,
      config: 'Content-Type: application/json;',
    }).then(
      function(response) {
        $('#exampleModalCenterError').modal('hide'); 
        $scope.prescriptions=[];
        var healthInfoId='HI1001';
        $scope.healthData="";
        if(sessionStorage.getItem('userId')=='prakash@tampachallenge'){
          healthInfoId='HI1002';
          $scope.healthData="1";
          $scope.customerName="Prakash Trivedi";
        }else if(sessionStorage.getItem('userId')=='surendra@tampachallenge'){
          healthInfoId='HI1001';
          $scope.healthData="2";
          $scope.customerName="Surendra Kushwaha";
        }
        console.log(" response data::"+healthInfoId);
        for (i = 0; i < response.data.length; i++) {
          var prescription = {
            customerId: response.data[i].customerId,
            date:  $scope.dateFormat(new Date(response.data[i].dateCreated)),
            customerId: response.data[i].customerId,
            patientName:
              response.data[i].customer.firstName +" "+
              response.data[i].customer.lastName,
            pharmacyName: response.data[i].insurer.insurerId,
            providerName: response.data[i].employer.employerName,
            prescriptionId: response.data[i].healthInfoId,
            dailySignal: response.data[i].dailySignal,
            geoCodingInfo: response.data[i].geoCodingInfo,
            lifeStyleInfo: response.data[i].lifeStyleInfo,
            heartRateDuringMedicine: response.data[i].heartRateDuringMedicine,
            socialDeterminants: response.data[i].socialDeterminants,
            highRiskInfo: response.data[i].highRiskInfo,
            nearByFacilities: response.data[i].nearByFacilities,
          
            showViewButton: true,
          };
          console.log("customer details:: "+JSON.stringify(prescription))
          if(prescription.prescriptionId==healthInfoId)
          $scope.prescriptions.push(prescription);
        }
        if($scope.prescriptions.length==0)
        {
          document.getElementById('error').style.display = 'block';
          document.getElementById('error').innerHTML=" <h6>No Record Found!</h6>";
        }
        else{
          document.getElementById('error').style.display = 'none';
        }
        $scope.count=[...Array($scope.prescriptions.length + 1).keys()];
        $scope.rowLimit=$scope.prescriptions.length;
      },
      function(response) {
        $('#exampleModalCenterError').modal('hide'); 
        $scope.error = reason.data;
      },
    );
    $scope.dateFormat = function(date) {
      var monthNames = [
        'Jan',
        'Feb',
        'March',
        'April',
        'May',
        'June',
        'July',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      return (
        monthNames[date.getMonth()] +
        ' ' +
        date.getDate() +
        ', ' +
        date.getFullYear()
      );
    };
    $scope.search = function() {
      var check=0;
      if($scope.patientName==="")
      $scope.patientName=undefined;
      if($scope.prescriptionId==="")
      $scope.prescriptionId=undefined;
      if($scope.pharmacyName==="")
      $scope.pharmacyName=undefined;
      if($scope.providerName==="")
      $scope.providerName=undefined;

      if($scope.patientName!==undefined)
      {if ($scope.patientName.split(' ').length < 1) {
        document.getElementById('error').style.display = 'block';
          document.getElementById('error').innerHTML=" <h6>Please Enter Patient's Full Name!</h6>";
        return;
      }
      else{
        document.getElementById('error').style.display = 'none';
      }
      check++;
      }
      if($scope.prescriptionId!==undefined)
      check++;
      if($scope.pharmacyName!==undefined)
      check++;
      if($scope.providerName!==undefined)
      {if ($scope.providerName.split(' ').length < 1) {
        document.getElementById('error').style.display = 'block';
          document.getElementById('error').innerHTML=" <h6>Please Enter Doctor's Full Name!</h6>";
          $scope.prescriptions.length=0;
        return;
      }
      else{
        document.getElementById('error').style.display = 'none';
      }
        check++;
        }

        if(check>1)
        {
          alert("Please Search by only 1 paratmeter!!");
          return;
        }
      
    };
    $scope.getPrescription = function(prescriptionId) {
    /*   for(var i=0;i<$scope.prescriptions.length;i++){
        if ($scope.prescriptions[i].prescriptionId === prescriptionId) {
          sessionStorage.setItem('prescription', JSON.stringify($scope.prescriptions[i]));
          $window.location.href = '/authorityPrescriptionView.html';
          return;
        }
      }; */
      sessionStorage.setItem('prescriptionId',prescriptionId);
      $window.location.href = '/authorityPrescriptionView.html';
    };
  });

  if(!('name' in sessionStorage))
  {
    window.location.href='/';
  }
