const { LND_GRPC_OPERATION } = require("test_birkeland_lnd/operations");
const topup_birkeland_wallet_item = require("./../birkeland_controller/../birkeland_wallets/topup_birkeland_wallet_item");

const poll_and_update_on_chain_transaction = async () => {
  try {
    console.log("poll_and_update_on_chain_transaction")
    let filter = { transaction_confirmed: false };
    
    let resp = await topup_birkeland_wallet_item.find(filter);
    let chain_balance = await test_birkeland_lnd.PerformAuthenticatedOperation({operation : LND_GRPC_OPERATION.GET_U_TXOS});
    console.log(chain_balance)
    for (let count =0;count <resp.length; count++) {
        let filter_object = {
            chain_address : resp[count]["chain_address"],
            public_key : resp[count]["public_key"],
            wallet_id : resp[count]["wallet_id"],
            user_id : resp[count]["user_id"]
        }
        console.log(filter_object)

    }
    console.log("---------------------------------")
  } catch (err) {
    console.log(err);
  }
};

module.exports={poll_and_update_on_chain_transaction}