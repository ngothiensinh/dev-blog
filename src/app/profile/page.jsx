import React from 'react';
import profileData from '../../../data/authors/profile.json';

const ProfilePage = () => {
  const { short_desc, basic_if, sections } = profileData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Profile Page</h1>
      </div>
      <div className="max-w-lg mx-auto">
        <hr className="border-t-2 border-gray-200 mb-4 opacity-20" />
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Short Description</h2>
          <p className="mb-4">{short_desc}</p>
        </div>

        <hr className="border-t-2 border-gray-200 mb-8 opacity-20" />

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Basic Information</h2>
          <ul>
            <li className="mb-2"><span className="font-semibold">Name:</span> {basic_if.name}</li>
            <li className="mb-2"><span className="font-semibold">Email:</span> {basic_if.email}</li>
            <li className="mb-2"><span className="font-semibold">Location:</span> {basic_if.location}</li>
            <li className="mb-2"><span className="font-semibold">Website:</span> <a href={basic_if.website} className="text-blue-500 hover:underline">{basic_if.website}</a></li>
            {/* <li className="mb-2"><span className="font-semibold">Social Media:</span>
              <ul className="ml-4">
                {Object.entries(basic_if.social_media).map(([platform, link]) => (
                  <li key={platform}><a href={link} className="text-blue-500 hover:underline">{platform}</a></li>
                ))}
              </ul>
            </li> */}
          </ul>
        </div>

        <hr className="border-t-2 border-gray-200 mb-8 opacity-20" />

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Work History</h2>
          <ul>
            {sections.work_history.slice(0, 2).map((job, index) => (
              <li key={index} className="mb-2">
                <div><strong>{job.position}</strong> at {job.company} <span className="opacity-20">({job.duration})</span><br /></div>
                {/* <div className="opacity-20">{job.company}</div> */}
                <div>{job.description}</div>
              </li>
            ))}
            {sections.work_history.length > 2 && (
              <button className="text-blue-500 hover:underline" onClick={() => alert('Show more jobs')}>Show More</button>
            )}
          </ul>
        </div>

        <hr className="border-t-2 border-gray-200 mb-8 opacity-20" />

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Skills</h2>
          <div className="flex flex-wrap">
            {sections.skills.map((skill, index) => (
              <div key={index} className="mr-4 mb-2">{skill}</div>
            ))}
          </div>
        </div>

        <hr className="border-t-2 border-gray-200 mb-8 opacity-20" />

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Certificates</h2>
          <ul>
            {sections.certificates.map((certificate, index) => (
              <li key={index} className="mb-2">{certificate}</li>
            ))}
          </ul>
        </div>

        <hr className="border-t-2 border-gray-200 mb-8 opacity-20" />

        <div>
          <h2 className="text-2xl font-semibold mb-2">Awards</h2>
          <ul>
            {sections.awards.map((award, index) => (
              <li key={index} className="mb-2">{award}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
