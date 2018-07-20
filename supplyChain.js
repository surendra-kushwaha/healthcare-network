const BusinessNetworkConnection = require('composer-client')
  .BusinessNetworkConnection;
const dateTime = require('node-datetime');
// import { BusinessNetworkConnection } from 'composer-client';
// const logger = require('../../logger');
// import logger from '../../logger';

//const cardName = 'admin@poc';//farmer1@poc
const cardName = 'admin@healthcare-network';
const workspace = 'com.tampa.healthcare';
/* eslint-disable no-unused-vars */
let factory;

class SupplyChain {
  constructor(cardName) {
    console.log('constructor() : Initializing business network');
    this.bizNetworkConnection = new BusinessNetworkConnection();
    this.cardName=cardName;
    console.log("this.cardName:"+this.cardName);
    this.bizNetworkConnection.on('event', event => {
      console.log('event', event);
    })
  }

  /** @description Initalizes the LandRegsitry by making a connection to the Composer runtime
   * @return {Promise} A promise whose fullfillment means the initialization has completed
   */
  init() {
    return this.bizNetworkConnection.connect(this.cardName)
      .then((result) => {
        console.log('init() : getting connection');
        this.businessNetworkDefinition = result;
        console.log('E-produce:<init>', 'businessNetworkDefinition obtained', this.businessNetworkDefinition.getIdentifier());
        factory = this.businessNetworkDefinition.getFactory();
      })
      .catch(function (error) {
        console.log("error!!" + error);
        throw error;
      });

  }

  listHealthInfo() {
    const METHOD = 'listproducesByownerName'
    let produces = [];
    return this.bizNetworkConnection.getAssetRegistry(`${workspace}.HealthInfo`).then(
      (produceRegistry) => {
        console.info(METHOD, 'Getting all assets from the registry.');
        return produceRegistry.resolveAll().then((produceRegistry) => {
          produces = produceRegistry.filter(produce => {
            return produce.healthInfoId == 'HI1001'
          });
          return produces;
        });
      });
  }

  listHealthInfoByEmployer(employerId) {
    const METHOD = 'listproducesByownerName'
    let produces = [];
    return this.bizNetworkConnection.getAssetRegistry(`${workspace}.HealthInfo`).then(
      (produceRegistry) => {
        console.info(METHOD, 'Getting all assets from the registry.');
        return produceRegistry.resolveAll().then((produceRegistry) => {
          produces = produceRegistry.filter(produce => {
            return produce.employer.employerId == employerId
          });
          return produces;
        });
      });
  };


  updateHealthInfo(healthInfo) {
    if (healthInfo.healthInfoId === '') {
      console.log(`Generating produceId`);
      produceId = (Math.floor(1000 + Math.random() * 9000)).toString();
      console.log(`produceId ID: ${healthInfo.healthInfoId}`);
    }

    let customer = factory.newRelationship(
            workspace,
            'Customer',
            'C1001',
          );

          let employer = factory.newRelationship(
            workspace,
            'Employer',
            'E1001',
          );

          let insurer = factory.newRelationship(
            workspace,
            'Insurer',
            'I1001',
          );

          const dailySignal = factory.newConcept(workspace, 'DailySignal');
            dailySignal.avgHeartRate = healthInfo.dailySignal.avgHeartRate;
            dailySignal.sleetDuration = healthInfo.dailySignal.sleepDuration;
            dailySignal.stepsCovered = healthInfo.dailySignal.stepsCovered;
            dailySignal.caloriesBurnt = healthInfo.dailySignal.caloriesBurnt;
            dailySignal.caloriesTaken = healthInfo.dailySignal.caloriesTaken;

          const geoCodingInfo = factory.newConcept(workspace, 'GeoCodingInfo');
            geoCodingInfo.geoLocation = healthInfo.geoCodingInfo.geoLocation;
            geoCodingInfo.epidemics = healthInfo.geoCodingInfo.epidemics;
            geoCodingInfo.hotSpots = healthInfo.geoCodingInfo.hotSpots;

          const lifeStyleInfo = factory.newConcept(workspace, 'LifeStyleInfo');
            lifeStyleInfo.smoking = healthInfo.lifeStyleInfo.smoking;
            lifeStyleInfo.alcohol = healthInfo.lifeStyleInfo.alcohol;
            lifeStyleInfo.carbonatedDrinks = healthInfo.lifeStyleInfo.carbonatedDrinks;

          const heartRateDuringMedicine = factory.newConcept(workspace, 'HeartRateDuringMedicine');
            heartRateDuringMedicine.avgBeforeConsumption = healthInfo.heartRateDuringMedicine.avgBeforeConsumption;
            heartRateDuringMedicine.avgAfterConsumption = healthInfo.heartRateDuringMedicine.avgAfterConsumption;

          const socialDeterminants = factory.newConcept(workspace, 'SocialDeterminants');
            socialDeterminants.dailyCommute = healthInfo.socialDeterminants.dailyCommute;
            socialDeterminants.familyConflict = healthInfo.socialDeterminants.familyConflict;  
            socialDeterminants.workshift = healthInfo.socialDeterminants.workshift;  

          const highRiskInfo = factory.newConcept(workspace, 'HighRiskInfo');
            highRiskInfo.risk = healthInfo.highRiskInfo.risk;
            highRiskInfo.bloodPressure = healthInfo.highRiskInfo.bloodPressure;  
            highRiskInfo.lifeStyleDiseases = healthInfo.highRiskInfo.lifeStyleDiseases;

            const nearByFacilities = factory.newConcept(workspace, 'NearByFacilities');
            nearByFacilities.communityCare = healthInfo.nearByFacilities.communityCare;
            nearByFacilities.restaurant = healthInfo.nearByFacilities.restaurant;  
            nearByFacilities.informationalMeetup = healthInfo.nearByFacilities.informationalMeetup;
            nearByFacilities.fitnessCenter = healthInfo.nearByFacilities.fitnessCenter;
            
          
    // Checking whether the provided or generated produceId exists in blockchain
    return this.bizNetworkConnection.getAssetRegistry(`${workspace}.HealthInfo`).then((produceRegistry) => {
      console.log('got produce registry');


      return produceRegistry.exists(healthInfo.healthInfoId).then((result) => {
        if (result) {
          console.log(`produce exists. Update Action  be performed`);
          //return Promise.all(addRequiredFields).then(() => {
            const healthInfoAsset = factory.newResource(
              workspace,
              'HealthInfo',
              healthInfo.healthInfoId,
            );

            //let pharmaAsset    = factory.newRelationship('acit.supplyChain.dataModel','PharmaAsset',assetId);

            healthInfoAsset.customer = customer;
            healthInfoAsset.employer = employer;
            healthInfoAsset.insurer = insurer; 

            healthInfoAsset.dailySignal = dailySignal;
            healthInfoAsset.geoCodingInfo = geoCodingInfo;
            healthInfoAsset.lifeStyleInfo = lifeStyleInfo;
            healthInfoAsset.heartRateDuringMedicine = heartRateDuringMedicine;
            healthInfoAsset.socialDeterminants = socialDeterminants;
            healthInfoAsset.highRiskInfo = highRiskInfo; 
            healthInfoAsset.nearByFacilities = nearByFacilities;   
            healthInfoAsset.dateCreated = new Date();       
            //console.log(produceAsset);
            return produceRegistry.update(healthInfoAsset).then(() => {
              console.log(`Produce updated`);
              //console.log(`Produce added`);
              return true;
            }).catch((error) => {
              console.log('Produce not added');
              console.log(error);
              return false;
            });
          //return false;
        } else {
          console.log(`produce does not exists. Proceeding`);

          //return Promise.all(addRequiredFields).then(() => {
            const healthInfoAsset = factory.newResource(
              workspace,
              'HealthInfo',
              healthInfo.healthInfoId,
            );
            healthInfoAsset.customer = customer;
            healthInfoAsset.employer = employer;
            healthInfoAsset.insurer = insurer; 

            healthInfoAsset.dailySignal = dailySignal;
            healthInfoAsset.geoCodingInfo = geoCodingInfo;
            healthInfoAsset.lifeStyleInfo = lifeStyleInfo;
            healthInfoAsset.heartRateDuringMedicine = heartRateDuringMedicine;
            healthInfoAsset.socialDeterminants = socialDeterminants;
            healthInfoAsset.highRiskInfo = highRiskInfo; 
            healthInfoAsset.nearByFacilities = nearByFacilities;
            healthInfoAsset.dateCreated = new Date();         
            //console.log(produceAsset);
            return produceRegistry.add(healthInfoAsset).then(() => {
              console.log(`Produce added`);
              return true;
            }).catch((error) => {
              console.log('Produce not added');
              console.log(error);
              return false;
            });
          //})
        }
      });
    });
  }

  transferownership(transferRequest) {
    return this.bizNetworkConnection.getAssetRegistry(`${workspace}.produce`).then((produceRegistry) => {
      console.log('got produce registry');
      return produceRegistry.exists(transferRequest.produceId).then((result) => {
        console.log("produce exists?");
        if (result) {
          console.log("Yes, it exists");
          let issueMedsTransaction = factory.newTransaction(workspace, 'transferprocudeownership');
          //issueMedsTransaction.currentDate = new Date();
          console.log("Got produce! ");
          const produceRelationship = factory.newRelationship(
            workspace,
            'produce',
            transferRequest.produceId,
          );

          issueMedsTransaction.newownerparticipantKey = transferRequest.newOwnerId;
          issueMedsTransaction.produceid = transferRequest.produceId;
          issueMedsTransaction.newownerusertype = transferRequest.newOwnerType;
          return this.bizNetworkConnection.submitTransaction(issueMedsTransaction).then(() => {
            console.log("Transaction has been completed.");
            return produceRegistry.resolve(transferRequest.produceId).then((resolved_produce) => {
              //console.log('resolved produce ' + JSON.stringify(resolved_produce.medicineList, null, 2))
              return resolved_produce;
            })
          }).catch((error) => {
            console.log(error);
          });
        }
      });
    });
  }

  getHistory(produceId) {
    const transactionArray = [];
    return this.bizNetworkConnection.getHistorian().then((historianRecordRegistry) => {
      console.log('Inside getHistorian');
      // Get all records
      return historianRecordRegistry.getAll().then((historianRecords) => {
          return this.bizNetworkConnection.getTransactionRegistry(workspace + '.transferprocudeownership').then(transferprocudeownership => {
            return this.bizNetworkConnection.getTransactionRegistry('org.hyperledger.composer.system.AddAsset').then(addAssetRegistry => {

              // Get transferprocudeownership registry
              // Find all records with transferprocudeownership transaction type
              return Promise.all(historianRecords.map(historyRecord => {
                if (historyRecord.transactionType === workspace + '.transferprocudeownership') {
                  console.log('Inside getHistorian@@');
                  const transactionId = historyRecord.transactionId;
                  return transferprocudeownership.resolve(transactionId).then((transferprocudeownership) => {
                    console.log('Inside getHistorian##'+transferprocudeownership.produceid + "produceId:"+produceId);
                    // Check that our transaction relates to our wanted prescription.
                      if (transferprocudeownership.produceid === produceId) {
                        const transactionResults = {
                            produce_id: transferprocudeownership.produceid,
                            owner_id: historyRecord.participantInvoking.$identifier,
                            new_owner_id:transferprocudeownership.newownerparticipantKey, 
                            new_owner_type:transferprocudeownership.newownerusertype,
                            timestamp: transferprocudeownership.timestamp,
                            transaction: 'transferprocudeownership'
                        }
                        // console.log(checkExpiryTransaction);
                        transactionArray.push(transactionResults);
                      }
                    })
                } else if (historyRecord.transactionType === 'org.hyperledger.composer.system.AddAsset') {
                  console.log('Events emitted', historyRecord.eventsEmiited);
                  // Resolve addAsset transactions based on the prescription Id.
                  const transactionId = historyRecord.transactionId;
                  return addAssetRegistry.resolve(transactionId).then((addAssetTransaction) => {
                    // console.log(addAssetTransaction.resources[0].prescriptionId);
                    // Check that our transaction relates to our wanted prescription.
                    if (addAssetTransaction.resources[0].produceid === produceId) {
                      // console.log(addAssetTransaction)
                      const transactionResults = {
                        produce_id: addAssetTransaction.resources[0].produceid,
                        owner_id: historyRecord.participantInvoking.$identifier,
                        timestamp: addAssetTransaction.timestamp,
                        transaction: 'Produce created'
                      }
                      transactionArray.push(transactionResults);
                    }
                  });
                }
              }))
            }).then(() => {
              return transactionArray;
            })
          //})
        })
      })
    })
  }

}

module.exports = SupplyChain;
