import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { contractAddress, abi } from '../constants'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { useNotification } from 'web3uikit'
import { Cross } from '@web3uikit/icons'
import { Checkmark } from '@web3uikit/icons'

export default function JoinWhitelist() {
  const dispatch = useNotification()
  const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
  const [numOfwhitelisted, setNumOfwhitelisted] = useState('0')
  const [loading, setLoading] = useState(false)

  const chainId = parseInt(chainIdHex)

  const whitelistAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null

  const { runContractFunction: addAddressToWhitelist } = useWeb3Contract({
    abi: abi,
    contractAddress: whitelistAddress,
    functionName: 'addAddressToWhitelist',
    params: {},
  })

  const { runContractFunction: getNumAddressesWhitelisted } = useWeb3Contract({
    abi: abi,
    contractAddress: whitelistAddress,
    functionName: 'getNumAddressesWhitelisted',
    params: {},
  })

  async function updateUIValues() {
    try {
      const numAddressesWhitelistedFromCall = (
        await getNumAddressesWhitelisted()
      ).toString()

      setNumOfwhitelisted(numAddressesWhitelistedFromCall)
    } catch (error) {
      console.log(error)
    }
  }

  async function joinWhitelist() {
    setLoading(true)
    await addAddressToWhitelist({
      onSuccess: handleSuccess,
      onError: (error) => {
        console.log(error)
      },
    })
    setLoading(false)
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues()
      if (chainId !== 5) {
        handleErrorNotification()
      }
    }
  }, [isWeb3Enabled])

  useEffect(() => {
    if (chainId !== 5) {
      handleErrorNotification()
    }
  }, [chainId])

  const handleNewNotification = () => {
    dispatch({
      type: 'info',
      message: 'Transaction Complete!',
      title: 'Transaction Notification',
      position: 'topR',
      icon: <Checkmark fontSize="50px" />,
    })
  }

  const handleErrorNotification = () => {
    dispatch({
      type: 'error',
      message: 'Switch To Goerli!',
      title: 'Wrong Smart Chain',
      position: 'topR',
      icon: <Cross fontSize="50px" />,
    })
  }

  const handleErrorNotificationAddress = () => {
    dispatch({
      type: 'error',
      message: 'Address already joined Whitelist',
      title: 'Already Used Address',
      position: 'topR',
      icon: <Cross fontSize="50px" />,
    })
  }

  const handleSuccess = async (tx) => {
    try {
      await tx.wait(1)
      updateUIValues()
      handleNewNotification(tx)
    } catch (erorr) {
      console.log(erorr)
    }
  }

  return (
    <div className={styles.main}>
      <div>
        <h1 className={styles.title}> Welcome to Crypto Devs!</h1>
        <div className={styles.description}>
          Its an NFT collection for developers in Crypto.
        </div>
        <div className={styles.description}>
          {numOfwhitelisted} have already joined the whitelist
        </div>
        <button className={styles.button} onClick={joinWhitelist}>
          {loading ? (
            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
          ) : (
            'Join Whitelist!'
          )}
        </button>
      </div>
      <div>
        <img className={styles.image} src="./crypto-devs.svg" />
      </div>
    </div>
  )
}

//Index whitelist?
