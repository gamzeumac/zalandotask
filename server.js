'use strict'

const express = require('express')
const app = express()
app.use(express.json())

const candidates = []

const sortSkillsMatchCount = (firstCandidate, secondCandidate) => {
    if (firstCandidate.matchCount < secondCandidate.matchCount) {
        return 1
    }
    
    if (firstCandidate.matchCount > secondCandidate.matchCount) {
        return -1
    }
    
    return 0
}

const countIntersection = (candidate, skills) => {
    const intersection = candidate
        .skills
        .filter(candidateSkills => skills.includes(candidateSkills))
        
    return intersection.length
}

const filterCandidate = (candidates, skills) => {
    const candidateWithSkillsMathCount = candidates.map(candidate => {
        const matchCount = countIntersection(candidate, skills)
        
        return {
            ...candidate,
            matchCount
        }
    })

    const [selectCandidate] = candidateWithSkillsMathCount
        .sort(sortSkillsMatchCount)
        
    if (selectCandidate && selectCandidate.matchCount > 0) {
        return selectCandidate
    }
}

const buildSkillList = (skillsParam) => {
    return skillsParam.split(',')
}

app.post('/candidates', function(req, res) {
  candidates.push(req.body)
  
  return res.send('OK')
})

app.get('/candidates/search', function(req, res) {
  const { skills } = req.query
  
  const skillList = buildSkillList(skills)
  
  const candidate = filterCandidate(candidates, skillList)
  
  if (!candidate) {
      return res.status(404).send('Not Found')
  }
  
  return res.send(candidate)
})

app.listen(process.env.HTTP_PORT || 3000)