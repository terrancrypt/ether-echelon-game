-include .env

deploy-engine:; forge script script/DeployEEEngine.s.sol:DeployEEEngine --rpc-url $(POLYGON_MUMBAI_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(POLYGON_SCAN_API_KEY) -vvvv

deploy-arbitrum:; forge script script/DeployEEEngine.s.sol:DeployEEEngine --rpc-url $(ARBI_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(ARBISCAN_API_KEY) -vvvv