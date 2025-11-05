from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class RecommendationEngine:
    def __init__(self):
        self.vectorizer = None
        self.job_vectors = None
        self.jobs = []
    
    def _create_vectorizer(self, num_jobs):
        """Create vectorizer with safe parameters for real job data"""
        # Dynamically adjust min_df and max_df based on number of jobs
        if num_jobs <= 5:
            min_df = 1
            max_df = 1.0  # Accept all terms
        elif num_jobs <= 10:
            min_df = 1
            max_df = 0.9
        else:
            min_df = 1
            max_df = 0.8
        
        print(f"[Engine] Vectorizer config: min_df={min_df}, max_df={max_df}, num_jobs={num_jobs}")
        
        return TfidfVectorizer(
            analyzer='word',
            ngram_range=(1, 2),
            lowercase=True,
            stop_words='english',
            max_features=500,
            min_df=min_df,
            max_df=max_df,
            strip_accents='unicode',
            decode_error='ignore',
            norm='l2',
            smooth_idf=True,
            sublinear_tf=True
        )
    
    def train(self, jobs):
        """Train the model with job descriptions"""
        try:
            print(f"\n[Engine] ========== TRAINING START ==========")
            print(f"[Engine] Number of jobs: {len(jobs)}")
            
            if not jobs or len(jobs) == 0:
                print("[Engine] ERROR: No jobs provided")
                raise ValueError("Jobs list is empty")
            
            self.jobs = jobs
            
            # Validate and prepare job texts
            job_texts = []
            for i, job in enumerate(jobs):
                try:
                    title = str(job.get('title', '')).strip()
                    description = str(job.get('description', '')).strip()
                    skills = ' '.join([str(s).strip() for s in job.get('skillsRequired', [])])
                    location = str(job.get('location', '')).strip()
                    company = str(job.get('companyName', '')).strip()
                    jobType = str(job.get('jobType', '')).strip()
                    
                    # Combine all fields with repetition for importance
                    combined_text = f"{title} {title} {description} {skills} {skills} {location} {company} {jobType}"
                    
                    if not combined_text.strip():
                        print(f"[Engine] WARNING: Job {i} has empty text")
                        combined_text = f"Job {i}"
                    
                    job_texts.append(combined_text)
                    print(f"[Engine] Job {i} ({job.get('_id', 'unknown')}): {len(combined_text)} chars")
                    
                except Exception as e:
                    print(f"[Engine] ERROR processing job {i}: {str(e)}")
                    raise
            
            print(f"[Engine] All {len(job_texts)} jobs prepared")
            print(f"[Engine] Creating vectorizer with {len(job_texts)} documents...")
            
            # Create vectorizer
            self.vectorizer = self._create_vectorizer(len(job_texts))
            
            print(f"[Engine] Fitting vectorizer...")
            
            try:
                # Fit and transform
                self.job_vectors = self.vectorizer.fit_transform(job_texts)
                
                print(f"[Engine] Vectorization complete!")
                print(f"[Engine] Vector shape: {self.job_vectors.shape}")
                print(f"[Engine] Vocabulary size: {len(self.vectorizer.get_feature_names_out())}")
                print(f"[Engine] Sparsity: {100 * (1 - self.job_vectors.nnz / (self.job_vectors.shape[0] * self.job_vectors.shape[1])):.2f}%")
                print(f"[Engine] ========== TRAINING SUCCESS ==========\n")
                
                return True
            except ValueError as ve:
                # Handle "no terms remain" error
                print(f"[Engine] TF-IDF error: {str(ve)}")
                print(f"[Engine] Attempting recovery with relaxed parameters...")
                
                # Try with even more relaxed parameters
                recovery_vectorizer = TfidfVectorizer(
                    analyzer='word',
                    ngram_range=(1, 1),  # Only unigrams
                    lowercase=True,
                    stop_words=None,  # No stop words
                    max_features=1000,
                    min_df=1,
                    max_df=1.0,
                    strip_accents='unicode',
                    decode_error='ignore',
                    norm='l2',
                    smooth_idf=True
                )
                
                self.vectorizer = recovery_vectorizer
                self.job_vectors = self.vectorizer.fit_transform(job_texts)
                
                print(f"[Engine] Recovery successful!")
                print(f"[Engine] Vector shape: {self.job_vectors.shape}")
                print(f"[Engine] Vocabulary size: {len(self.vectorizer.get_feature_names_out())}")
                print(f"[Engine] ========== TRAINING SUCCESS (RECOVERY) ==========\n")
                
                return True
                
        except Exception as e:
            print(f"[Engine] ========== TRAINING FAILED ==========")
            print(f"[Engine] ERROR: {str(e)}")
            print(f"[Engine] ========== TRAINING FAILED ==========\n")
            import traceback
            traceback.print_exc()
            raise
    
    def recommend(self, candidate_profile, top_n=5):
        """Get top N job recommendations for a candidate"""
        try:
            print(f"\n[Engine] ========== RECOMMENDATION START ==========")
            
            if self.job_vectors is None:
                print("[Engine] ERROR: Model not trained yet")
                raise ValueError("Model not trained. Call train() first")
            
            if self.vectorizer is None:
                print("[Engine] ERROR: Vectorizer not initialized")
                raise ValueError("Vectorizer not initialized")
            
            # Get candidate data
            skills = candidate_profile.get('skills', [])
            experience = candidate_profile.get('experience', 0)
            location = candidate_profile.get('location', '')
            
            print(f"[Engine] Candidate skills: {skills}")
            print(f"[Engine] Candidate experience: {experience}")
            print(f"[Engine] Candidate location: {location}")
            
            if not skills:
                print("[Engine] WARNING: No skills provided")
                skills = ["developer"]
            
            # Create candidate text with repetition
            candidate_text = f"{' '.join(skills)} {' '.join(skills)} {experience} years {location}"
            print(f"[Engine] Candidate text: {candidate_text[:100]}...")
            
            # Validate candidate text
            if not candidate_text.strip():
                print("[Engine] ERROR: Candidate text is empty")
                raise ValueError("Candidate profile data is empty")
            
            # Transform candidate text
            try:
                candidate_vector = self.vectorizer.transform([candidate_text])
                print(f"[Engine] Candidate vector shape: {candidate_vector.shape}")
            except Exception as e:
                print(f"[Engine] ERROR transforming candidate text: {str(e)}")
                raise
            
            # Calculate similarity scores
            try:
                scores = cosine_similarity(candidate_vector, self.job_vectors)[0]
                print(f"[Engine] Scores calculated for {len(scores)} jobs")
                print(f"[Engine] Score range - Min: {scores.min():.4f}, Max: {scores.max():.4f}, Mean: {scores.mean():.4f}")
            except Exception as e:
                print(f"[Engine] ERROR calculating similarity: {str(e)}")
                raise
            
            # Get top N indices
            if len(scores) == 0:
                print("[Engine] WARNING: No scores calculated")
                return []
            
            top_indices = np.argsort(scores)[::-1][:min(top_n, len(scores))]
            print(f"[Engine] Top {len(top_indices)} jobs selected")
            
            # Build recommendations
            recommendations = []
            for rank, idx in enumerate(top_indices):
                score = float(scores[idx])
                
                # Lower threshold for small datasets
                if score > 0.01 or len(recommendations) < 3:
                    if idx < len(self.jobs):
                        job = self.jobs[idx]
                        skills_match = self._get_skills_match(
                            candidate_profile.get('skills', []),
                            job.get('skillsRequired', [])
                        )
                        
                        rec = {
                            "jobId": str(job.get("_id", f"job_{idx}")),
                            "title": job.get("title", ""),
                            "companyName": job.get("companyName", ""),
                            "location": job.get("location", ""),
                            "similarity_score": score,
                            "skills_match": skills_match
                        }
                        recommendations.append(rec)
                        print(f"[Engine] Rank {rank+1}: {rec['title'][:40]} - Score: {score:.4f}")
            
            print(f"[Engine] ========== RECOMMENDATION SUCCESS ==========")
            print(f"[Engine] Returned {len(recommendations)} recommendations\n")
            return recommendations
            
        except Exception as e:
            print(f"[Engine] ========== RECOMMENDATION FAILED ==========")
            print(f"[Engine] ERROR: {str(e)}")
            print(f"[Engine] ========== RECOMMENDATION FAILED ==========\n")
            import traceback
            traceback.print_exc()
            raise
    
    def _get_skills_match(self, candidate_skills, required_skills):
        """Calculate skill match percentage"""
        if not required_skills or len(required_skills) == 0:
            return 0
        
        try:
            candidate_skills_lower = [str(s).lower().strip() for s in candidate_skills]
            required_skills_lower = [str(s).lower().strip() for s in required_skills]
            
            matched = sum(1 for skill in required_skills_lower if skill in candidate_skills_lower)
            percentage = (matched / len(required_skills)) * 100
            
            return round(percentage, 2)
        except Exception as e:
            print(f"[Engine] ERROR calculating skill match: {str(e)}")
            return 0

# Global engine instance
engine = RecommendationEngine()
