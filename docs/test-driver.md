# Test VIM Driver

The Test VIM driver allows testing the internal business logic of the NFVO, without requiring you instantiating real resources
 on any PoP. 

The Test VIM driver source code is available at [this GitHub repository](https://github.com/openbaton/test-plugin)

It must be used in combination with the dummy VNFM, so that a complete lifecycle is simulated without resources being deployed.
You may follow the [dummy NSR][dummy-nsr] tutorial as an example of usage of the test driver in combination with the dummy VNFM. 

[dummy-nsr]: dummy-NSR.md