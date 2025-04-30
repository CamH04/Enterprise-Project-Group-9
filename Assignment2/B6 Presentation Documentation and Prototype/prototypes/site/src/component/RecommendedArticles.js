import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TextToSpeech from './TextToSpeech';
import MedAudio from './static/g_med.mp3';

import './recc.css';

const RecommendedArticles = () => {
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchRecommendedArticles = async () => {
      try {
        if (!token) throw new Error('No token found in local storage');

        const moodsResponse = await axios.get('http://localhost:5000/userMoods', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (moodsResponse.status === 200 && moodsResponse.data.moods.length > 0) {
          const keywords = moodsResponse.data.moods.map(mood => mood.keywords).join(',');

          const articlesResponse = await axios.get('http://localhost:5000/recommendedArticles', {
            params: { keywords },
            headers: { Authorization: `Bearer ${token}` },
          });

          if (articlesResponse.status === 200) {
            setRecommendedArticles(articlesResponse.data.recommendedArticles);
          } else {
            throw new Error('Failed to fetch recommended articles');
          }
        } else {
          throw new Error('No moods found for the user, Why not fill out the mood tracker to start getting some recommendations');
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError(error.response?.data?.error || error.message || 'An error occurred');
        if (error.response?.status === 403 || error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedArticles();
  }, [navigate]);

  const handleExpandClick = (index) => {
    const updatedArticles = [...recommendedArticles];
    updatedArticles[index].expanded = !updatedArticles[index].expanded;
    setRecommendedArticles(updatedArticles);
  };

  const formatContent = (content) => {
    return content.replace(/\n/g, '<br />');
  };

  if (loading) return <div>Loading recommended articles...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="nhsuk-container">
      <h2>Recommended Articles</h2>
      {recommendedArticles.length === 0 ? (
        <p>No articles found based on your moods.</p>
      ) : (
        <div>
          {recommendedArticles.map((article, index) => (
            <div key={index} className="article-container">
              <h3>{article.title}</h3>
              <div className="article-content">
                <p
                  dangerouslySetInnerHTML={{
                    __html: article.expanded
                      ? formatContent(article.content)
                      : formatContent(article.content.substring(0, 200) + '...'),
                  }}
                />
                <button onClick={() => handleExpandClick(index)}>
                  {article.expanded ? 'Read Less' : 'Read More'}
                </button>
                <TextToSpeech text={article.content} />
              </div>
            </div>
          ))}
        </div>
      )}
      <h2>Recommended Videos</h2>
      <a href="https://www.nhs.uk/live-well/exercise/pilates-and-yoga/bedtime-meditation/" target="_blank"><h3>Link: NHS Bedtime Meditation Video</h3></a>
      <iframe src="https://www.nhs.uk/live-well/exercise/pilates-and-yoga/bedtime-meditation/" width="800" height="600">
        Your browser does not support this feature, please open in a new window.
      </iframe>
      <h2>Recommended Audio</h2>
      <h3>Meditation Walkthrough</h3>
       <audio controls autoplay>
        <source src={MedAudio} type="audio/mpeg"></source>
      Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default RecommendedArticles;
