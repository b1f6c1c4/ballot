{
  "targets": [
    {
      "target_name": "cryptor",
      "cflags_cc!": [ "-fno-exceptions", "-fno-rtti" ],
      "sources": [
        "main.cpp",
        "ring.cpp",
        "ringImpl.cpp",
      ],
    }
  ]
}
