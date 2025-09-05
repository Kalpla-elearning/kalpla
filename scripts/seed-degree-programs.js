const { PrismaClient } = require('@prisma/client')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const prisma = new PrismaClient()

async function seedDegreePrograms() {
  try {
    console.log('🌱 Seeding degree programs...')

    // Get or create an instructor
    let instructor = await prisma.user.findFirst({
      where: { role: 'INSTRUCTOR' }
    })

    if (!instructor) {
      instructor = await prisma.user.create({
        data: {
          email: 'degree.instructor@kalpla.in',
          name: 'Dr. Sarah Johnson',
          role: 'INSTRUCTOR',
          bio: 'Senior Academic Director at Kalpla University',
          isVerified: true,
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
        }
      })
      console.log(`✅ Created instructor: ${instructor.name}`)
    }

    // Create sample degree programs
    const degreePrograms = [
      {
        title: 'Bachelor of Computer Science',
        slug: 'bachelor-computer-science',
        description: 'A comprehensive 4-year undergraduate program in Computer Science covering programming, algorithms, data structures, software engineering, and modern technologies.',
        institution: 'Kalpla University',
        location: 'Bangalore, India',
        duration: '4 years',
        format: 'HYBRID',
        level: 'UNDERGRADUATE',
        price: 250000,
        currency: 'INR',
        category: 'Computer Science',
        tags: ['Programming', 'Software Engineering', 'Algorithms', 'Data Science'],
        features: [
          'Industry-relevant curriculum',
          'Hands-on projects',
          'Internship opportunities',
          'Career placement assistance',
          'Modern programming languages',
          'Cloud computing basics'
        ],
        requirements: [
          '12th grade completion with 60% marks',
          'Mathematics and Physics in 12th grade',
          'English proficiency',
          'Basic computer knowledge'
        ],
        syllabus: [
          {
            semester: 1,
            subjects: [
              'Programming Fundamentals',
              'Mathematics I',
              'Computer Organization',
              'English Communication'
            ]
          },
          {
            semester: 2,
            subjects: [
              'Data Structures',
              'Mathematics II',
              'Digital Logic Design',
              'Environmental Studies'
            ]
          }
        ],
        imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop',
        brochureUrl: 'https://example.com/brochure-bcs.pdf',
        maxStudents: 60,
        isFeatured: true,
        status: 'PUBLISHED'
      },
      {
        title: 'Master of Business Administration (MBA)',
        slug: 'master-business-administration-mba',
        description: 'A 2-year postgraduate program designed to develop business leaders with strong analytical, strategic, and leadership skills.',
        institution: 'Kalpla Business School',
        location: 'Mumbai, India',
        duration: '2 years',
        format: 'ONLINE',
        level: 'GRADUATE',
        price: 450000,
        currency: 'INR',
        category: 'Business',
        tags: ['Management', 'Leadership', 'Strategy', 'Finance'],
        features: [
          'Case study methodology',
          'Industry mentorship',
          'International exchange programs',
          'Leadership development',
          'Networking opportunities',
          'Capstone project'
        ],
        requirements: [
          'Bachelor\'s degree with 50% marks',
          '2+ years work experience',
          'GMAT/GRE scores',
          'English proficiency test',
          'Personal interview'
        ],
        syllabus: [
          {
            semester: 1,
            subjects: [
              'Financial Accounting',
              'Marketing Management',
              'Organizational Behavior',
              'Quantitative Methods'
            ]
          },
          {
            semester: 2,
            subjects: [
              'Operations Management',
              'Strategic Management',
              'Human Resource Management',
              'Business Ethics'
            ]
          }
        ],
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
        brochureUrl: 'https://example.com/brochure-mba.pdf',
        maxStudents: 40,
        isFeatured: true,
        status: 'PUBLISHED'
      },
      {
        title: 'Diploma in Data Science',
        slug: 'diploma-data-science',
        description: 'A 1-year intensive diploma program covering data analysis, machine learning, and big data technologies.',
        institution: 'Kalpla Institute of Technology',
        location: 'Hyderabad, India',
        duration: '1 year',
        format: 'ONLINE',
        level: 'DIPLOMA',
        price: 85000,
        currency: 'INR',
        category: 'Computer Science',
        tags: ['Data Science', 'Machine Learning', 'Python', 'Statistics'],
        features: [
          'Hands-on projects',
          'Industry datasets',
          'Mentorship program',
          'Portfolio development',
          'Job placement assistance',
          'Certification'
        ],
        requirements: [
          'Bachelor\'s degree in any field',
          'Basic mathematics knowledge',
          'Computer literacy',
          'English proficiency'
        ],
        syllabus: [
          {
            semester: 1,
            subjects: [
              'Python Programming',
              'Statistics and Probability',
              'Data Visualization',
              'Database Management'
            ]
          },
          {
            semester: 2,
            subjects: [
              'Machine Learning',
              'Big Data Technologies',
              'Data Mining',
              'Capstone Project'
            ]
          }
        ],
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
        brochureUrl: 'https://example.com/brochure-dds.pdf',
        maxStudents: 30,
        isFeatured: false,
        status: 'PUBLISHED'
      },
      {
        title: 'Certificate in Digital Marketing',
        slug: 'certificate-digital-marketing',
        description: 'A 6-month certificate program covering all aspects of digital marketing including SEO, social media, and analytics.',
        institution: 'Kalpla Marketing Academy',
        location: 'Delhi, India',
        duration: '6 months',
        format: 'ONLINE',
        level: 'CERTIFICATE',
        price: 35000,
        currency: 'INR',
        category: 'Business',
        tags: ['Digital Marketing', 'SEO', 'Social Media', 'Analytics'],
        features: [
          'Live projects',
          'Industry tools training',
          'Certification exam',
          'Career guidance',
          'Networking events',
          'Portfolio building'
        ],
        requirements: [
          '12th grade completion',
          'Basic computer skills',
          'English communication',
          'Internet access'
        ],
        syllabus: [
          {
            module: 1,
            subjects: [
              'Introduction to Digital Marketing',
              'Search Engine Optimization (SEO)',
              'Content Marketing',
              'Social Media Marketing'
            ]
          },
          {
            module: 2,
            subjects: [
              'Email Marketing',
              'Pay-Per-Click (PPC)',
              'Analytics and Reporting',
              'Final Project'
            ]
          }
        ],
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
        brochureUrl: 'https://example.com/brochure-cdm.pdf',
        maxStudents: 50,
        isFeatured: false,
        status: 'PUBLISHED'
      },
      {
        title: 'Master of Technology in Artificial Intelligence',
        slug: 'master-technology-artificial-intelligence',
        description: 'A 2-year advanced program in AI covering machine learning, deep learning, natural language processing, and AI ethics.',
        institution: 'Kalpla Institute of Advanced Technology',
        location: 'Chennai, India',
        duration: '2 years',
        format: 'ON_CAMPUS',
        level: 'GRADUATE',
        price: 600000,
        currency: 'INR',
        category: 'Engineering',
        tags: ['Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'NLP'],
        features: [
          'Research opportunities',
          'Industry partnerships',
          'Thesis project',
          'AI lab access',
          'International conferences',
          'PhD preparation'
        ],
        requirements: [
          'Bachelor\'s in Engineering/CS',
          'Mathematics background',
          'Programming experience',
          'GATE score preferred',
          'Research aptitude'
        ],
        syllabus: [
          {
            semester: 1,
            subjects: [
              'Machine Learning Fundamentals',
              'Linear Algebra for AI',
              'Probability and Statistics',
              'Programming for AI'
            ]
          },
          {
            semester: 2,
            subjects: [
              'Deep Learning',
              'Natural Language Processing',
              'Computer Vision',
              'AI Ethics'
            ]
          }
        ],
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
        brochureUrl: 'https://example.com/brochure-mtech-ai.pdf',
        maxStudents: 25,
        isFeatured: true,
        status: 'PUBLISHED'
      }
    ]

    for (const programData of degreePrograms) {
      const existingProgram = await prisma.degreeProgram.findUnique({
        where: { slug: programData.slug }
      })

      if (!existingProgram) {
        const program = await prisma.degreeProgram.create({
          data: {
            title: programData.title,
            slug: programData.slug,
            description: programData.description,
            institution: programData.institution,
            location: programData.location,
            duration: programData.duration,
            format: programData.format,
            level: programData.level,
            price: programData.price,
            currency: programData.currency,
            category: programData.category,
            tags: JSON.stringify(programData.tags),
            features: JSON.stringify(programData.features),
            requirements: JSON.stringify(programData.requirements),
            syllabus: JSON.stringify(programData.syllabus),
            imageUrl: programData.imageUrl,
            brochureUrl: programData.brochureUrl,
            maxStudents: programData.maxStudents,
            isFeatured: programData.isFeatured,
            status: programData.status,
            instructorId: instructor.id
          }
        })

        console.log(`✅ Created degree program: ${program.title}`)
      } else {
        console.log(`ℹ️  Degree program already exists: ${existingProgram.title}`)
      }
    }

    console.log('🎉 Degree programs seeded successfully!')

  } catch (error) {
    console.error('❌ Error seeding degree programs:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedDegreePrograms()
