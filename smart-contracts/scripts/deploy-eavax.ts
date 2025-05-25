import { ethers, run } from "hardhat";
import { deployLibrary, deployVerifiers } from "../test/helpers";
import { EncryptedERC__factory } from "../typechain-types";

const main = async () => {
    // get deployer
    const [deployer] = await ethers.getSigners();

    // deploy verifiers with proper trusted setup
    const {
        registrationVerifier,
        mintVerifier,
        withdrawVerifier,
        transferVerifier,
    burnVerifier,
    } = await deployVerifiers(deployer, true);

    // deploy babyjub library
    const babyJubJub = await deployLibrary(deployer);

    // deploy registrar contract
    const registrarFactory = await ethers.getContractFactory("Registrar");
    const registrar = await registrarFactory.deploy(registrationVerifier);
    await registrar.waitForDeployment();

    // deploy eERC20
    const encryptedERCFactory = new EncryptedERC__factory({
        "contracts/libraries/BabyJubJub.sol:BabyJubJub": babyJubJub,
    });
    const encryptedERC_ = await encryptedERCFactory.connect(deployer).deploy({
        registrar: registrar.target,
        isConverter: true, // This is a converter eERC
        name: "encrypted wrapped avax",
        symbol: "eAVAX",
        mintVerifier,
        withdrawVerifier,
        transferVerifier,
    burnVerifier,
        decimals: 18,
        convertedToken: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
    });
    await encryptedERC_.waitForDeployment();

    console.table({
        registrationVerifier,
        mintVerifier,
        withdrawVerifier,
        transferVerifier,
    burnVerifier,
        babyJubJub,
        registrar: registrar.target,
        encryptedERC: encryptedERC_.target,
    });

    console.log("\nWaiting for block confirmations before verification...");
    await new Promise(resolve => setTimeout(resolve, 30000)); // 30 second delay

    console.log("\nStarting contract verification...");

    // Verify Registration Verifier contract
    try {
        await run("verify:verify", {
            address: registrationVerifier,
            constructorArguments: [],
        });
        console.log("Registration Verifier contract verified!");
    } catch (error) {
        console.error("Registration Verifier verification failed:", error);
    }

    // Verify Mint Verifier contract
    try {
        await run("verify:verify", {
            address: mintVerifier,
            constructorArguments: [],
        });
        console.log("Mint Verifier contract verified!");
    } catch (error) {
        console.error("Mint Verifier verification failed:", error);
    }

    // Verify Withdraw Verifier contract
    try {
        await run("verify:verify", {
            address: withdrawVerifier,
            constructorArguments: [],
        });
        console.log("Withdraw Verifier contract verified!");
    } catch (error) {
        console.error("Withdraw Verifier verification failed:", error);
    }

    // Verify Transfer Verifier contract
    try {
        await run("verify:verify", {
            address: transferVerifier,
            constructorArguments: [],
        });
        console.log("Transfer Verifier contract verified!");
    } catch (error) {
        console.error("Transfer Verifier verification failed:", error);
    }

  // Verify Burn Verifier contract
  try {
    await run("verify:verify", {
      address: burnVerifier,
      constructorArguments: [],
    });
    console.log("Burn Verifier contract verified!");
  } catch (error) {
    console.error("Burn Verifier verification failed:", error);
  }

    // Verify BabyJubJub library
    try {
        await run("verify:verify", {
            address: babyJubJub,
            constructorArguments: [],
        });
        console.log("BabyJubJub library verified!");
    } catch (error) {
        console.error("BabyJubJub verification failed:", error);
    }

    // Verify Registrar contract
    try {
        await run("verify:verify", {
            address: registrar.target,
            constructorArguments: [registrationVerifier],
        });
        console.log("Registrar contract verified!");
    } catch (error) {
        console.error("Registrar verification failed:", error);
    }

    // Verify EncryptedERC contract
    try {
        await run("verify:verify", {
            address: encryptedERC_.target,
            constructorArguments: [{
                registrar: registrar.target,
                isConverter: true,
                name: "encrypted wrapped avax",
                symbol: "eAVAX",
                mintVerifier,
                withdrawVerifier,
                transferVerifier,
        burnVerifier,
                decimals: 18,
                convertedToken: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
            }],
        });
        console.log("EncryptedERC contract verified!");
    } catch (error) {
        console.error("EncryptedERC verification failed:", error);
    }
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});