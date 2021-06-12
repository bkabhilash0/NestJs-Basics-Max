import Head from "next/head";
import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetail";

const DetailPage = (props) => {
  const data = { ...props.meetupData };
  return (
    <>
      <Head>
        <meta name="description" content={props.meetupData.description} />
        <title>{props.meetupData.title}</title>
      </Head>
      <MeetupDetail {...data} />
    </>
  );
};

export async function getStaticPaths() {
  // Add all the dynamic route params
  const DBURL = "mongodb://localhost:27017/React-Meetups";
  const client = await MongoClient.connect(DBURL);
  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: false,
    paths: meetups.map((item) => ({
      params: {
        meetupId: item._id.toString(),
      },
    })),
  };
}

export async function getStaticProps(context) {
  // Fetch the Data for the single Meetup
  const meetupId = context.params.meetupId;
  const DBURL = "mongodb://localhost:27017/React-Meetups";
  const client = await MongoClient.connect(DBURL);
  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  const meetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) });

  const data = {
    id: meetup._id.toString(),
    title: meetup.title,
    address: meetup.address,
    description: meetup.description,
    image: meetup.image,
  };

  client.close();
  return {
    props: {
      meetupData: data,
    },
    revalidate: 10,
  };
}
export default DetailPage;
