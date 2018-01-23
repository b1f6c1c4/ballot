#include "argon.h"
#include "argonImpl.h"

json Argon::argon2i(const json &param)
{
	logger->trace("Argon::argon2i");
	auto &&pwd = param.at("password").get<std::string>();

	ArgonSaltType salt;
	if (param.find("salt") != param.end())
	{
		logger->debug("Salt provided");
		salt = ArgonImpl::Inst().fromJson<SALT_BYTE>(param.at("salt"));
	}
	else
	{
		logger->debug("No salt provided");
		salt = ArgonImpl::Inst().genSalt();
	}

	logger->trace("Calling argonImpl");
	auto &&hash = ArgonImpl::Inst().runArgon(pwd, salt);

	logger->trace("Finalize");
	json j;
	j["salt"] = ArgonImpl::Inst().toString(salt);
	j["hash"] = ArgonImpl::Inst().toString(hash);
	return j;
}
