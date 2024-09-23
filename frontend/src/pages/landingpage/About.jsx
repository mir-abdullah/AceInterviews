/* eslint-disable no-unused-vars */
import React from "react";
import aboutImg from "../../assets/about.png";

// motion
import { motion } from "framer-motion";
// variants
import { fadeIn } from "../../variants";

const About = () => {
  return (
    <div>
      {/* about text */}
      <div className="px-4 lg:px-14 max-w-screen-2xl mx-auto my-8" id="about">
        <div className="md:w-11/12 mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <motion.div
            variants={fadeIn("right", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.6 }}
          >
            <img src={aboutImg} alt="" className="w-full" />
          </motion.div>
          <motion.div
            variants={fadeIn("left", 0.3)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.5 }}
            className="md:w-3/5 mx-auto"
          >
            <h2 className="text-4xl text-neutralDGrey font-semibold mb-4 md:w-4/5">
              Elevate Your Interview Skills with{" "}
              <span className="text-brandPrimary">AceInterview</span>
            </h2>
            <p className="md:w-3/4 text-sm text-neutralGrey mb-8">
              AceInterview empowers you to master the art of interviews with
              comprehensive simulations and real-time feedback, tailored to your
              career aspirations. Our platform guides you through every step,
              from behavioral cues to technical prowess, ensuring you stand out
              in the competitive job market.
            </p>
            <button className="btn-primary">Learn More</button>
          </motion.div>
        </div>
      </div>

      {/* company stats */}
      <motion.div
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.7 }}
        className="px-4 lg:px-14 max-w-screen-2xl mx-auto bg-neutralSilver py-16"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="text-4xl text-neutralDGrey font-semibold mb-2 md:w-2/3">
              Transforming Career Preparation <br />{" "}
              <span className="text-brandPrimary">Across the Globe</span>
            </h2>
            <p>
              Our commitment to enhancing interview preparedness is reflected in
              our impressive user milestones and global reach.
            </p>
          </div>

          {/* stats */}
          <div className="md:w-1/2 mx-auto flex sm:flex-row flex-col sm:items-center justify-around gap-12">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <img src="/src/assets/icons/group.png" alt="" />
                <div>
                  <h4 className="text-2xl text-neutralDGrey font-semibold">
                    500,000+
                  </h4>
                  <p>Global Users</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <img src="/src/assets/icons/clubs.png" alt="" />
                <div>
                  <h4 className="text-2xl text-neutralDGrey font-semibold">
                    3,200+
                  </h4>
                  <p>Training Sessions</p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <img src="/src/assets/icons/click.png" alt="" />
                <div>
                  <h4 className="text-2xl text-neutralDGrey font-semibold">
                    1,000,000+
                  </h4>
                  <p>Mock Interviews</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <img src="/src/assets/icons/payments.png" alt="" />
                <div>
                  <h4 className="text-2xl text-neutralDGrey font-semibold">
                    95%
                  </h4>
                  <p>Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
