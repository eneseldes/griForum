import "./HomePage.scss";
import PostList from "../../components/PostList/PostList.jsx";

const DUMMY_POSTS = [
  {
    id: 1,
    image: "/coding.png",
    category: "Coding",
    title: "Easiest way for React State Management",
    excerpt:
      "State management is a fundamental concept in React development, crucial for building dynamic and interactive user interfaces.",
    date: "2025-08-27",
    link: "/posts/1",
  },
  {
    id: 2,
    image: "/tekno.png",
    category: "Technology",
    title: "Why Technology Matters in 2025",
    excerpt:
      "Technology Technology is crucial because it enhances efficiency, improves communication, provides access to information,",
    date: "2025-07-10",
    link: "/posts/2",
  },
    {
    id: 3,
    image: "/car.png",
    category: "Life Style",
    title: "151 Lifestyle Blog Post Ideas That Will Delight Your Readers",
    excerpt:
      "A diverse range of lifestyle blog post ideas can engage readers.",
    date: "2025-08-27",
    link: "/posts/1",
  },
];

function HomePage() {
  return (
    <div className="home-page">
      <div className="landing-page">
        <div className="landing-content">
          <h1>Write,Share and Inspire - Because Every Story Deserves an Audience</h1>
          <p>Read and write amazing stories from people around the world</p>
          <button className="landing-button">Write a Story</button>
        </div>
        
      </div>
      
      <h1>Recent Posts</h1>
      <PostList posts={DUMMY_POSTS} />
    </div>
  );
}

export default HomePage;
