import type { GetServerSideProps, GetServerSidePropsResult, GetStaticProps, GetStaticPropsResult, NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'

export interface HN {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
}

interface Props {
  hns?: HN[]
}

const HackerNews: NextPage<Props> = ({ hns }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <>
          <h1 className={styles.title}>
            Hacker News Top Ten
          </h1>
          <div className={styles.grid} >

            {hns?.map(hn =>
              <Link href={`hackernews/${hn.id}`} key={hn.id}>
                <a className={styles.card}>
                  <h2>{hn.title}</h2>
                  <p>Score: {hn.score}</p>
                </a>
              </Link>
            )}
          </div>
        </>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default HackerNews

interface Params {
  hns: HN[]
}

export const getStaticProps: GetStaticProps = async (): Promise<GetStaticPropsResult<Params>> => {

  console.log(`Fetching Latest HN`);
  const hn: [number] = await (await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')).json()

  if (!hn) {
    return {
      notFound: true,
    }
  }

  const first = hn.slice(0, 10);

  const hns: HN[] = [];
  //This is terrible performance, you will want to thread.
  for (let index = 0; index < first.length; index++) {
    await (await fetch(`https://hacker-news.firebaseio.com/v0/item/${first[index]}.json`)).json().then(f => hns.push(f))
  }
  return {
    props: {
      hns
    },
    revalidate: 3600
  }
}