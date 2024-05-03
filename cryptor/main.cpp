#include "common.h"
#include <node/node.h>
#include <node/v8-object.h>
#include <node/v8-primitive.h>
#include <node/v8-typed-array.h>
#include "ring.h"

#ifndef VERSION
#define VERSION "UNKNOWN"
#endif

#ifndef COMMITHASH
#define COMMITHASH "UNKNOWN"
#endif

#ifndef IS_TEST
extern size_t g_WIDTH_BIT;
#endif

void Status(const v8::FunctionCallbackInfo<v8::Value> &args) {
    v8::Isolate *isolate = args.GetIsolate();
    args.GetReturnValue().Set(v8::String::NewFromUtf8(isolate, "Ok").ToLocalChecked());
}

void NewRing(const v8::FunctionCallbackInfo<v8::Value> &args) {
    v8::Isolate *isolate = args.GetIsolate();
    auto res = Ring::Inst().newRing().dump();
    args.GetReturnValue().Set(v8::String::NewFromUtf8(isolate, res.c_str()).ToLocalChecked());
}

void GenH(const v8::FunctionCallbackInfo<v8::Value> &args) {
    v8::Isolate *isolate = args.GetIsolate();
    if (args.Length() != 1) {
        args.GetReturnValue().SetUndefined();
        return;
    }
    const v8::String::Utf8Value str(isolate, args[0]);
    auto res = Ring::Inst().genH(json::parse(*str)).dump();
    args.GetReturnValue().Set(v8::String::NewFromUtf8(isolate, res.c_str()).ToLocalChecked());
}

void Verify(const v8::FunctionCallbackInfo<v8::Value> &args) {
    v8::Isolate *isolate = args.GetIsolate();
    if (args.Length() != 1) {
        args.GetReturnValue().SetUndefined();
        return;
    }
    const v8::String::Utf8Value str(isolate, args[0]);
    auto res = Ring::Inst().verify(json::parse(*str));
    args.GetReturnValue().Set(v8::Boolean::New(isolate, res));
}

void Initialize(v8::Local<v8::Object> exports) {
    const auto &&logger = Logger{"Main"}.logger;
    logger->info("Version {}", VERSION);
    logger->info("CommitHash {}", COMMITHASH);

#ifndef IS_TEST
    logger->info("Crypto width bit {}", g_WIDTH_BIT);
#endif

    NODE_SET_METHOD(exports, "status", Status);
    NODE_SET_METHOD(exports, "newRing", NewRing);
    NODE_SET_METHOD(exports, "genH", GenH);
    NODE_SET_METHOD(exports, "verify", Verify);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
