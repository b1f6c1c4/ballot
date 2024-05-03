{
  "targets": [
    {
      "target_name": "cryptor",
      "cflags_cc!": [ "-fno-exceptions", "-fno-rtti" ],
      "sources": [
        "common.cpp",
        "main.cpp",
        "ring.cpp",
        "ringImpl.cpp",
      ],
      "libraries": [
        "/usr/lib/libcryptopp.so",
      ],
    }
  ]
}
