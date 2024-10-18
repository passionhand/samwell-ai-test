'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface ImageProps {
  id: string;
  urls: {
    small: string;
  };
  alt_description: string;
}

const Home: React.FC = () => {
  const [images, setImages] = useState<ImageProps[]>([]);
  const [tags, setTags] = useState<{ [index: number]: string[] }>({});

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get('http://localhost:5000/images');
        setImages(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchImage();
  }, []);

  const analyzeImage = async (imageUrl: string): Promise<string[]> => {
    try {
      const response = await axios.post('http://localhost:5000/analyze', {
        imageUrl
      });
      return response.data.tags;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleClick = async (index: number) => {
    const data = await analyzeImage(images[index].urls.small);
    setTags((prevTags) => ({
      ...prevTags,
      [index]: data
    }));
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl text-center font-bold mb-6">
        Automated Image Fetching and AI Tagging
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div key={image.id} className="flex flex-col items-center">
            <div className="w-full h-[200px] relative">
              <Image
                src={image.urls.small}
                alt={image.alt_description}
                fill
                priority
                sizes="200px"
              />
            </div>
            <button
              onClick={() => handleClick(index)}
              className="w-full px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
            >
              Analyze Image
            </button>
            {tags[index] && (
              <div className="mt-2">
                <div className="text-gray-600 flex">
                  {tags[index].map((tag) => (
                    <p key={tag} className="px-2">
                      #{tag}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
