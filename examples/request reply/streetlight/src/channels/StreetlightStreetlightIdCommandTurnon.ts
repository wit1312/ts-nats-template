
import * as TurnonCommandMessage from '../messages/TurnonCommand'
import * as GeneralReplyMessage from '../messages/GeneralReply'
import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import {ErrorCode, NatsTypescriptTemplateError} from '../NatsTypescriptTemplateError';
import { Hooks } from '../hooks';
  
export function reply(
    onRequest: (err?: NatsTypescriptTemplateError, msg?: TurnonCommandMessage.TurnonCommand, streetlight_id?: string) =>Promise<GeneralReplyMessage.GeneralReply>, 
    onReplyError: (err: NatsTypescriptTemplateError) => void,
    nc: Client
    
      ,streetlight_id: string
    ,
    options?: SubscriptionOptions
  ): Promise<Subscription> {
  return new Promise(async (resolve, reject) => {
    try {
      let subscribeOptions: SubscriptionOptions = {... options};

      let subscription = nc.subscribe(`streetlight.${streetlight_id}.command.turnon`,async (err, msg) => {
        if (err) {
          onRequest(err);
        } else {
          
var unmodifiedChannel = `streetlight.{streetlight_id}.command.turnon`;
var channel = msg.subject;
	var streetlightIdSplit = unmodifiedChannel.split("{streetlight_id}");

const splits = [
		streetlightIdSplit[0],
		streetlightIdSplit[1]
];
channel = channel.substring(splits[0].length);
var streetlightIdEnd = channel.indexOf(splits[1]);
var streetlightIdParam = "" + channel.substring(0, streetlightIdEnd);

          
try {
  let receivedDataHooks = Hooks.getInstance().getreceivedDataHook();
  var receivedData : any = msg.data;
  for(let hook of receivedDataHooks){
    receivedData = hook(receivedData);
  }
} catch (e) {
  const error = NatsTypescriptTemplateError.errorForCode(ErrorCode.HOOK_ERROR, e);
  onReplyError(error);
  return;
}


          let message =await onRequest(undefined, receivedData,
              streetlightIdParam);
          
          if (msg.reply) {
            
try{
  let beforeSendingHooks = Hooks.getInstance().getBeforeSendingDataHook();
  var dataToSend : any = message;
  for(let hook of beforeSendingHooks){
    dataToSend = hook(dataToSend);
  }
}catch(e){
  const error = NatsTypescriptTemplateError.errorForCode(ErrorCode.HOOK_ERROR, e);
  onReplyError(error)
  return;
}

            
            await nc.publish(msg.reply, dataToSend);
          } else {
            let error = new NatsTypescriptTemplateError('Expected request to need a reply, did not..', '000');
            onReplyError(error)
            return;
          }
        }
      }, subscribeOptions);
      resolve(subscription);
    } catch (e) {
      reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.INTERNAL_NATS_TS_ERROR, e));
    }
  })
}

