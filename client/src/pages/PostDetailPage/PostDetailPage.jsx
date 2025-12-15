import "./PostDetailPage.scss";
import CommentList from "../../components/CommentList/CommentList.jsx";
import CommentForm from "../../components/CommentList/CommentForm/CommentForm.jsx";
import LikeButton from "../../components/LikeButton/LikeButton.jsx";
import { FaRegClock } from "react-icons/fa6";


const post = {
  title: "Easiest way for React State Management",
  author: {
    name: "John Doe",
    avatar: "https://i.pravatar.cc/64?img=8",
  },
  date: "29 Aug 2025",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Web Development", href: "/category/web-development" },
  ],
  content: [
    "State management is an important aspect while developing react applications. Managing the 'state' i.e. the data that changes over time and affects what is displayed in the user interface is necessary today as the applications get complex with the new advancements and years passing by. It includes things like user inputs, responses from APIs, and the current status of different UI components. Effective state management ensures that the UI is updated consistently and correctly whenever the state changes thereby improving the application's reliability and user experience.",
    "State management in react is can be majorly divided into two parts.",
    "• Local state management: Managing state that is specific to a particular component. It involves handling data or UI elements that only need to affect a single component, making it a straightforward and efficient approach. React's own useState and useReducer hooks are sufficient to perform this.",
    "• Global state management: Managing state that needs to be shared across multiple components within an application. Unlike local state, which is confined to a single component, global state is accessible and modifiable by many components, regardless of their nesting level.",
    "While local state management in react can be done easily using useState and useReducer hooks, global state management requires dedicated and specific tools which are know as libraries to ensure a consistency and correctness in state management of react applications which are more complex.",
    "Use the solutions listed to Manage Complex State Flows Efficiently.",
  ],
};

const commentsData = [
  {
    id: 101,
    username: "Can Demir",
    date: "2 saat önce",
    text: "Kod örnekleri çok açıklayıcı, teşekkürler. Projemde hemen deneyeceğim.",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 102,
    username: "Zeynep Kaya",
    date: "Dün, 14:30",
    text: "Acaba bu bileşeni responsive yaparken hangi breakpoint'leri kullandınız? Mobilde biraz taşma yapıyor gibi.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 103,
    username: "Mehmet Öztürk",
    date: "10 Kasım 2023",
    text: "Süper içerik! 👍",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
  }
];

function PostDetailPage() {
  return (
    <div className="post-detail-page">
      <div className="container">
        <nav className="breadcrumbs">
          {post.breadcrumbs.map((bc, idx) => (
            <span key={bc.label} className="breadcrumbs__item">
              <a href={bc.href}>{bc.label}</a>
              <span className="breadcrumbs__sep"> / </span>
            </span>
          ))}
          <span className="breadcrumbs__current">{post.title}</span>
        </nav>

        <div className="layout">
          <div className="content-header">
            <h1 className="post-title">{post.title}</h1>

            <div className="post-meta">
              <img className="post-meta__avatar" src={post.author.avatar} alt={post.author.name} />
              <div className="post-meta__info">
                <span className="post-meta__author">{post.author.name}</span>
                <span className="post-meta__date"><FaRegClock /> {post.date}</span>
              </div>
            </div>
          </div>

          <main className="content-body">
            <article className="post-body">
              {post.content.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </article>

            <div className="post-actions">
              <LikeButton />
            </div>

            <section className="post-comments">
              <CommentForm />
              <CommentList comments={commentsData} />
            </section>
          </main>

          {/* Sidebar: Sonradan eklenicek*/}
          <aside className="sidebar">
            <h3 className="section-title">Most Popular</h3>
            <div className="sidebar__placeholder">Coming soon…</div>
            <h3 className="section-title">Categories</h3>
            <div className="sidebar__placeholder">Coming soon…</div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;
