import Head from "next/head";
import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";

const HomePage = (props) => {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Browse a Huge List of React Meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
};

export const getStaticProps = async (_context) => {
  // All server side code
  // Fetch data from DB
  // Always have to return an Object

  const DBURL = "mongodb://localhost:27017/React-Meetups";
  const client = await MongoClient.connect(DBURL);
  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find().toArray();
  client.close();

  return {
    props: {
      meetups: meetups.map((item) => ({
        title: item.title,
        address: item.address,
        description: item.description,
        image: item.image,
        id: item._id.toString(),
      })),
    },
    revalidate: 10,
  };
};

// export const getServerSideProps = async(context) => {
//     // const req = context.req;
//     // const res = context.res;
//     // Fetch the Data from API
//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     }
// }

export default HomePage;
