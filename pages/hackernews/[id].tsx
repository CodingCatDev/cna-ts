import type { GetStaticPaths, GetStaticPathsResult, GetStaticProps, GetStaticPropsResult, NextPage } from 'next'
import { ParsedUrlQuery } from 'querystring'

import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import { useRouter } from 'next/dist/client/router'

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
  hn?: HN
}

const HackerNews: NextPage<Props> = ({ hn }) => {
  const { isFallback } = useRouter();

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {isFallback ?
          (
            <div>Creating Page...</div>
          ) : (
            <>
              {hn &&
                <div className={styles.grid}>
                  <a href={hn.url} className={styles.card} target="_blank" rel="noopener noreferrer">
                    <h2>{hn.title}</h2>
                    <p>Score: {hn.score}</p>
                  </a>
                </div>
              }
            </>
          )}
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

interface StaticProps {
  hn: HN,
  id: string,
}

interface Params extends ParsedUrlQuery {
  id: string
}

export const getStaticPaths: GetStaticPaths = async (): Promise<GetStaticPathsResult<Params>> => {
  // Build page on request and cache at CDN
  //  return { paths: [], fallback: true }

  //Statically Build Pages at Build Time Only
  const hn: [string] = await (await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')).json()
  console.log(`Building: ${hn.length} pages`)

  const paths = hn.map(i => { return {params: {id: i.toString()}}});
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async (context): Promise<GetStaticPropsResult<StaticProps>> => {
  const { id } = context.params as Params;
  console.log(`Fetching:${id}`);

  const hn = await (await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)).json();

  if (!hn) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      hn,
      id,
    },
  }
}