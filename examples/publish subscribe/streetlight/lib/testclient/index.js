"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NatsAsyncApiTestClient = exports.AnonymousSchema_3 = exports.AnonymousSchema_1 = exports.streetlightStreetlightIdEventTurnonChannel = exports.streetlightStreetlightIdCommandTurnonChannel = void 0;
const NatsTypescriptTemplateError_1 = require("../NatsTypescriptTemplateError");
const Nats = __importStar(require("nats"));
const streetlightStreetlightIdCommandTurnonChannel = __importStar(require("./testchannels/StreetlightStreetlightIdCommandTurnon"));
exports.streetlightStreetlightIdCommandTurnonChannel = streetlightStreetlightIdCommandTurnonChannel;
const streetlightStreetlightIdEventTurnonChannel = __importStar(require("./testchannels/StreetlightStreetlightIdEventTurnon"));
exports.streetlightStreetlightIdEventTurnonChannel = streetlightStreetlightIdEventTurnonChannel;
const AnonymousSchema_1_1 = require("../models/AnonymousSchema_1");
Object.defineProperty(exports, "AnonymousSchema_1", { enumerable: true, get: function () { return AnonymousSchema_1_1.AnonymousSchema_1; } });
const AnonymousSchema_3_1 = require("../models/AnonymousSchema_3");
Object.defineProperty(exports, "AnonymousSchema_3", { enumerable: true, get: function () { return AnonymousSchema_3_1.AnonymousSchema_3; } });
/**
 * @class NatsAsyncApiTestClient
 *
 * The test/mirror client which is the reverse to the normal NatsAsyncApiClient.
 */
class NatsAsyncApiTestClient {
    /**
     * Try to connect to the NATS server with the different payloads.
     * @param options to use, payload is omitted if sat in the AsyncAPI document.
     */
    connect(options, codec) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (!this.isClosed()) {
                return reject('Client is still connected, please close it first.');
            }
            this.options = options;
            if (codec) {
                this.codec = codec;
            }
            else {
                this.codec = Nats.JSONCodec();
            }
            try {
                this.nc = yield Nats.connect(this.options);
                resolve();
            }
            catch (e) {
                reject(NatsTypescriptTemplateError_1.NatsTypescriptTemplateError.errorForCode(NatsTypescriptTemplateError_1.ErrorCode.INTERNAL_NATS_TS_ERROR, e));
            }
        }));
    }
    /**
     * Disconnect all clients from the server
     */
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isClosed() && this.nc !== undefined) {
                yield this.nc.drain();
            }
        });
    }
    /**
     * Returns whether or not any of the clients are closed
     */
    isClosed() {
        if (!this.nc || this.nc.isClosed()) {
            return true;
        }
        return false;
    }
    /**
     * Try to connect to the NATS server with user credentials
     *
     * @param userCreds to use
     * @param options to connect with
     */
    connectWithUserCreds(userCreds, options, codec) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect(Object.assign({ user: userCreds }, options), codec);
        });
    }
    /**
     * Try to connect to the NATS server with user and password
     *
     * @param user username to use
     * @param pass password to use
     * @param options to connect with
     */
    connectWithUserPass(user, pass, options, codec) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect(Object.assign({ user: user, pass: pass }, options), codec);
        });
    }
    /**
     * Try to connect to the NATS server which has no authentication
     
      * @param host to connect to
      * @param options to connect with
      */
    connectToHost(host, options, codec) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connect(Object.assign({ servers: [host] }, options), codec);
        });
    }
    /**
     * Publish to the `streetlight/{streetlight_id}/command/turnon` channel
     *
     * Channel for the turn on command which should turn on the streetlight
     *
     * @param message to publish
     * @param streetlight_id parameter to use in topic
     */
    publishToStreetlightStreetlightIdCommandTurnon(message, streetlight_id, options) {
        if (!this.isClosed() && this.nc !== undefined && this.codec !== undefined) {
            return streetlightStreetlightIdCommandTurnonChannel.publish(message, this.nc, this.codec, streetlight_id, options);
        }
        else {
            return Promise.reject(NatsTypescriptTemplateError_1.NatsTypescriptTemplateError.errorForCode(NatsTypescriptTemplateError_1.ErrorCode.NOT_CONNECTED));
        }
    }
    /**
     * Subscribe to the `streetlight/{streetlight_id}/event/turnon`
     *
     * Channel for when the streetlight is turned on
     *
     * @param onDataCallback to call when messages are received
     * @param streetlight_id parameter to use in topic
     * @param flush ensure client is force flushed after subscribing
     * @param options to subscribe with, bindings from the AsyncAPI document overwrite these if specified
     */
    subscribeToStreetlightStreetlightIdEventTurnon(onDataCallback, streetlight_id, flush, options) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (!this.isClosed() && this.nc !== undefined && this.codec !== undefined) {
                try {
                    const sub = yield streetlightStreetlightIdEventTurnonChannel.subscribe(onDataCallback, this.nc, this.codec, streetlight_id, options);
                    if (flush) {
                        yield this.nc.flush();
                    }
                    resolve(sub);
                }
                catch (e) {
                    reject(e);
                }
            }
            else {
                reject(NatsTypescriptTemplateError_1.NatsTypescriptTemplateError.errorForCode(NatsTypescriptTemplateError_1.ErrorCode.NOT_CONNECTED));
            }
        }));
    }
}
exports.NatsAsyncApiTestClient = NatsAsyncApiTestClient;
//# sourceMappingURL=index.js.map