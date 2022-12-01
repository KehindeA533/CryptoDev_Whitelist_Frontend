import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Header from '../components/Header'
import JoinWhitelist from '../components/JoinWhitelist'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>CryptoDev Whitelist</title>
        <meta name="description" content="CryptoDev Whitelist" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <JoinWhitelist />
      <Footer />
    </div>
  )
}
