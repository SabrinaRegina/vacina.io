const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');

//declate namespace
const namespace = 'org.example.basic';

//in-memory card store for testing so cards are not persisted to the file system
const cardStore = require('composer-common').NetworkCardStoreManager.getCardStore( { type: 'composer-wallet-inmemory' } );

//admin connection to the blockchain, used to deploy the business network
let adminConnection;

//this is the business network connection the tests will use.
let businessNetworkConnection;

let businessNetworkName = 'vacineblockchain';
let factory;

module.exports = {
   /*
  * Perform Vacinacao transaction
  * @param {String} cardId Card id to connect to network
  * @param {String} vacinaId Vacina Id
  * @param {String} nomeUBS Nome da UBS
  * @param {String} nomeProfissional Nome do profissional responsável na UBS
  * @param {String} coren Coren do profissional responsável
  * @param {String} lote Lote da vacina
  * @param {String} validade Validade da vacina
  * @param {String} estado Estado da vacina
  */
  vacinacaoTransaction: async function (cardId, vacinaId, nomeUBS, nomeProfissional, coren, lote, validade, estado){
    try {	//connect to network with cardId
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(cardId);

      //get the factory for the business network.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create transaction
      const vacinacao = factory.newTransaction(namespace, 'Vacinacao');
      vacinacao.asset = factory.newRelationship(namespace, 'Vacina', vacinaId);
      vacinacao.nomeUBS = nomeUBS;
      vacinacao.nomeProfissional = nomeProfissional;
      vacinacao.coren = coren;
      vacinacao.lote = lote;
      vacinacao.validade = validade;
      vacinacao.estado = estado;

      //submit transaction
      await businessNetworkConnection.submitTransaction(vacinacao);

      //disconnect
      await businessNetworkConnection.disconnect(cardId);

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }

  }
}
