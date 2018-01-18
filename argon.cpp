#include "argon.h"
#include "argonImpl.h"

json argon2i(const json &param)
{
	auto &&pwd = param.at("password").get<std::string>();
	ArgonSaltType salt;
	if (param.find("salt") != param.end())
		salt = fromJson<SALT_BYTE>(param.at("salt"));
	else
		salt = genSalt();

	json j;
	j["salt"] = toString(salt);
	j["hash"] = toString(runArgon(pwd, salt));
	return j;
}
