import React, { useState } from 'react';
import { Check, X, Brain, ChevronRight, Award, RotateCcw } from 'lucide-react';

const AdvancedOWLQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState({});

  const questions = [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'A Knowledge Graph uses the Description Logic SHOIN. Based on this, what can you definitively conclude?',
      options: [
        'The ontology will have decidable reasoning',
        'The ontology supports inverse properties but not cardinality restrictions',
        'The ontology cannot use SWRL rules',
        'The ontology is equivalent to OWL Full'
      ],
      correct: 0,
      explanation: 'SHOIN corresponds to OWL-DL, which is designed specifically to maintain decidability while offering high expressiveness. The "S" indicates ALC plus transitive properties, "H" adds role hierarchy, "O" adds nominals, "I" adds inverse properties, and "N" adds cardinality restrictions. OWL-DL guarantees that all reasoning tasks will terminate, unlike OWL Full.'
    },
    {
      id: 2,
      type: 'scenario',
      question: 'You define: HappyPerson ⊑ hasChild only HappyPerson. Alice is classified as a HappyPerson but has no recorded children in your knowledge base. Is this consistent?',
      options: [
        'No, this violates the restriction because HappyPerson requires having happy children',
        'Yes, "only" does not guarantee existence—it only constrains children IF they exist',
        'No, the reasoner will infer Alice must have at least one child',
        'Yes, but only under Closed World Assumption'
      ],
      correct: 1,
      explanation: 'This is a critical distinction! "hasChild only HappyPerson" uses universal quantification (∀), which translates to: "IF Alice has children, THEN all of them must be HappyPerson." If Alice has zero children, this constraint is vacuously satisfied. To require existence, you need "hasChild some HappyPerson" (∃). OWL operates under Open World Assumption, so absence of children doesn\'t mean they don\'t exist—it means we don\'t know.'
    },
    {
      id: 3,
      type: 'multiple-choice',
      question: 'Which statement about Description Logics versus First-Order Logic is most accurate?',
      options: [
        'DL sacrifices all expressiveness to achieve decidability',
        'DL uses carefully selected FOL fragments to balance expressiveness and decidability',
        'DL is more expressive than FOL but computationally expensive',
        'DL and FOL have identical expressiveness but different syntax'
      ],
      correct: 1,
      explanation: 'Description Logics use strategic fragments of First-Order Logic. They deliberately restrict which FOL constructs are allowed to ensure reasoning remains decidable and computationally tractable. This is the fundamental trade-off: DL is LESS expressive than full FOL, but gains guaranteed decidability. For example, DL typically restricts variables to specific patterns, avoiding arbitrary quantifier nesting that makes FOL undecidable.'
    },
    {
      id: 4,
      type: 'code-analysis',
      question: 'Examine this property chain: hasGrandparent ≡ hasParent ∘ hasParent. If you also define hasParent as transitive, what logical consequence occurs?',
      options: [
        'The property chain becomes redundant because transitivity already covers grandparents',
        'You create an inconsistency because property chains and transitivity conflict',
        'Transitivity will infer ALL ancestors through hasParent, making hasGrandparent a strict subset',
        'Nothing changes—property chains and transitivity operate independently'
      ],
      correct: 2,
      explanation: 'Declaring hasParent as transitive means: if hasParent(x,y) ∧ hasParent(y,z) → hasParent(x,z). This will chain indefinitely, making hasParent connect you to ALL ancestors (parents, grandparents, great-grandparents, etc.). Meanwhile, hasGrandparent specifically captures only the 2-hop relationship. So transitivity doesn\'t make the property chain redundant—it actually makes hasParent far more general. This demonstrates why you must carefully consider property characteristics in ontology design.'
    },
    {
      id: 5,
      type: 'debugging',
      question: 'Your ontology defines: MeatLoversPizza ⊑ hasTopping only Meat. The reasoner classifies a plain crust with no toppings as a MeatLoversPizza. What is the root cause?',
      options: [
        'The reasoner has a bug in handling universal restrictions',
        'Universal quantification ("only") is satisfied when there are zero instances',
        'You forgot to declare Meat and hasTopping as disjoint',
        'Plain crust should be explicitly defined as ¬MeatLoversPizza'
      ],
      correct: 1,
      explanation: 'This is the classic "only" trap! Universal quantification states: "FOR ALL toppings, IF they exist, they must be Meat." With zero toppings, this is vacuously true—there are no counter-examples. The fix is closure: MeatLoversPizza ⊑ (hasTopping some Meat) ⊓ (hasTopping only Meat). "Some" guarantees at least one meat topping exists, while "only" forbids non-meat toppings. Both together create the intended constraint.'
    },
    {
      id: 6,
      type: 'conceptual',
      question: 'What is the fundamental difference between ⊑ (SubClassOf) and ≡ (EquivalentTo) in terms of inference?',
      options: [
        'Both allow bidirectional inference, but ≡ is computationally faster',
        '⊑ allows one-way inference (A→B), while ≡ enables auto-classification in both directions',
        '⊑ is used for individuals, ≡ is used for classes',
        'There is no practical difference—both create the same logical entailments'
      ],
      correct: 1,
      explanation: 'This is crucial for ontology design! SubClassOf (⊑) creates a one-way implication: if x is A, we can infer x is B, but NOT vice versa. EquivalentTo (≡) is bidirectional: A ≡ B means A ⊑ B AND B ⊑ A. This enables automatic classification: if you assert x is B, the reasoner can infer x is A. Example: Mother ≡ Woman ⊓ Parent means asserting someone as a Woman who is a Parent automatically classifies them as Mother. With just ⊑, that inference wouldn\'t happen.'
    },
    {
      id: 7,
      type: 'property-reasoning',
      question: 'Property P is declared as both Functional and InverseFunctional. What does this guarantee about the relationship?',
      options: [
        'P must be symmetric',
        'P creates a one-to-one (1:1) mapping between individuals',
        'P must also be transitive',
        'P can only connect individuals within the same class'
      ],
      correct: 1,
      explanation: 'Functional means: each domain individual can relate to AT MOST one range individual (source → 1 target). InverseFunctional means: each range individual can be related to AT MOST one domain individual (1 source ← target). Together, they create a perfect 1:1 bijection. Example: hasHusband in strictly monogamous marriages. If both properties are declared, asserting hasHusband(Mary, John) and hasHusband(Mary, Bob) would make the reasoner infer John = Bob (same individual).'
    },
    {
      id: 8,
      type: 'cardinality',
      question: 'An ontology states: Person ⊑ hasChild max 4 Parent. John hasChild Alice, Bob, Carol (all Parents), and David (a Student). Does this satisfy the constraint?',
      options: [
        'No, John has 4 children total, violating max 4',
        'Yes, only 3 children are Parents, which is ≤ 4',
        'No, David must be explicitly stated as ¬Parent',
        'Depends on Open vs Closed World Assumption'
      ],
      correct: 1,
      explanation: 'This tests understanding of QUALIFIED cardinality. "hasChild max 4 Parent" means "at most 4 children who are instances of Parent class." It counts only the Parent-typed children (Alice, Bob, Carol = 3), ignoring David who is a Student. Note: OWL uses Open World Assumption, so if we don\'t know whether David is a Parent, we can\'t assume he isn\'t. But the question states David IS a Student, and typically Student and Parent would be disjoint classes. The key insight: qualified cardinality filters by type.'
    },
    {
      id: 9,
      type: 'swrl',
      question: 'You create the SWRL rule: childOf(?x, ?y) ∧ likeSport(?y, ?s) → likeSport(?x, ?s). After running the reasoner with this data: childOf(Alice, Bob) and likeSport(Bob, Football), what will be inferred?',
      options: [
        'Nothing, because SWRL rules require explicit rule execution separate from OWL reasoning',
        'likeSport(Alice, Football) will be automatically inferred',
        'The ontology becomes inconsistent due to the SWRL rule',
        'SWRL rules cannot reference object properties like likeSport'
      ],
      correct: 0,
      explanation: 'SWRL (Semantic Web Rule Language) rules are NOT part of standard OWL reasoning! They require a separate rule engine (like Pellet or Drools). While OWL reasoners perform standard DL inference (subsumption, classification, etc.), SWRL rules must be explicitly processed by a rule engine that can fire rules and add new assertions. Many ontology users mistakenly expect SWRL rules to "just work" when they run a standard reasoner, but rules need specific execution. This is why SWRL is considered an extension to OWL, not a core feature.'
    },
    {
      id: 10,
      type: 'multiple-choice',
      question: 'In the context of LLMs and Knowledge Graphs, what is the primary benefit of "Knowledge-Augmented Language Model Prompting (KAPING)"?',
      options: [
        'It eliminates the need for training LLMs by embedding all knowledge in prompts',
        'It reduces hallucinations by injecting relevant factual KG data into the prompt context',
        'It allows LLMs to directly update and maintain Knowledge Graphs',
        'It replaces symbolic reasoning with neural network approximations'
      ],
      correct: 1,
      explanation: 'KAPING addresses the hallucination problem by retrieving relevant facts from a structured Knowledge Graph and adding them to the user\'s input before sending it to the LLM. This provides grounding in verified, structured knowledge rather than relying solely on the LLM\'s probabilistic text generation. The LLM still generates the response, but with factual anchors from the KG. This is different from fine-tuning or embedding—it\'s a retrieval-augmented approach that keeps the KG and LLM separate but synergistic.'
    },
    {
      id: 11,
      type: 'deep-reasoning',
      question: 'Consider: Parent ≡ (hasChild some Person) ⊓ (hasChild only Person). Why is this definition redundant, and what would be a more precise formulation?',
      options: [
        'It\'s not redundant—both constraints are necessary for correctness',
        '"only Person" is redundant if hasChild already has range Person; the definition should just be: Parent ≡ hasChild some Person',
        'The intersection is wrong—it should use union instead',
        '"some Person" is redundant—"only" already implies existence'
      ],
      correct: 1,
      explanation: 'If hasChild already has range restriction "rdfs:range Person", then ALL values of hasChild must be Person by definition. Adding "hasChild only Person" in the class definition is therefore redundant—it doesn\'t add new constraints. The essential part is "hasChild some Person" which requires existence of at least one child. This is a common modeling mistake: over-constraining by repeating range restrictions at the class level. However, if you want to allow hasChild to sometimes relate to non-Persons in other contexts, then "only Person" in this specific class definition makes sense. The key is understanding what constraints come from property definitions vs. class axioms.'
    },
    {
      id: 12,
      type: 'owl-design',
      question: 'You need to model: "A person can have multiple pets, but each pet has exactly one owner." Which property characteristics correctly capture this?',
      options: [
        'hasPet: functional; ownedBy: functional',
        'hasPet: inverse functional; ownedBy: functional',
        'hasPet: unrestricted; ownedBy: functional',
        'hasPet: symmetric; ownedBy: inverse functional'
      ],
      correct: 2,
      explanation: 'Let\'s analyze: "Person can have multiple pets" → hasPet is NOT functional (one person → many pets). "Each pet has exactly one owner" → ownedBy IS functional (one pet → one owner). If we declare hasPet inverseOf ownedBy, then ownedBy being functional automatically makes hasPet inverse functional, meaning each pet can be owned by only one person (which is correct). The answer is: hasPet should have no functional restriction (allowing multiple pets), while ownedBy should be functional (enforcing single ownership). Declaring them as inverse properties makes the constraints propagate correctly.'
    },
    {
      id: 13,
      type: 'open-world',
      question: 'Your knowledge base contains: John hasChild max 3. You query if John has 4 children. Under Open World Assumption (OWA), what is the reasoner\'s response?',
      options: [
        '"No, John cannot have 4 children because max 3 constraint is violated"',
        '"Unknown—we don\'t have complete information about all of John\'s children"',
        '"Yes, because OWA assumes facts not stated are true"',
        'The reasoner will mark the ontology as inconsistent'
      ],
      correct: 1,
      explanation: 'This is a fundamental OWA vs CWA (Closed World Assumption) distinction! Under OWA, which OWL uses, absence of information does NOT mean something is false—it means we don\'t know. If we haven\'t explicitly stated all of John\'s children, we cannot definitively say he doesn\'t have a 4th child. The max 3 constraint means: "IF we knew John had 4 distinct children, that would be inconsistent." But without complete knowledge, the reasoner cannot conclude either way. This is why validating cardinality constraints in real-world KGs is challenging—you need explicit completeness assertions or closed-world assumptions at query time.'
    },
    {
      id: 14,
      type: 'advanced-reasoning',
      question: 'Property disjointness is declared: hasChild propertyDisjointWith hasSpouse. What happens if your KB contains both hasChild(John, Mary) and hasSpouse(John, Mary)?',
      options: [
        'The reasoner will automatically delete one of the assertions',
        'The reasoner will infer John ≠ Mary (different individuals)',
        'The ontology becomes inconsistent—this is a logical contradiction',
        'Nothing—disjointness is only a warning, not an error'
      ],
      correct: 2,
      explanation: 'Property disjointness is a hard constraint: it asserts that P and Q can NEVER hold for the same pair (x, y). The formal semantics state: ¬(P(x,y) ∧ Q(x,y)). If both assertions exist, the ontology becomes INCONSISTENT. The reasoner will detect this as an unsatisfiable constraint—there\'s no valid model where both statements can be true. This is different from class disjointness (which infers different individuals); property disjointness creates outright contradiction. Inconsistency detection is a key feature of OWL reasoners for quality assurance.'
    },
    {
      id: 15,
      type: 'llm-kg-integration',
      question: 'In the AutoRD system for rare disease knowledge graph construction, what is the primary role of the LLM?',
      options: [
        'To replace manual ontology engineering by generating complete KGs from scratch',
        'To extract domain-specific entities and relationships from text and map them to ontology structures',
        'To perform reasoning and inference over the constructed knowledge graph',
        'To validate the accuracy of medical information against clinical databases'
      ],
      correct: 1,
      explanation: 'AutoRD uses LLMs as intelligent extraction and mapping tools. The LLM processes domain-specific text (medical literature, clinical reports) to: (1) identify key entities (diseases, symptoms, treatments), (2) extract relationships between them, and (3) map these to predefined ontology structures. The LLM doesn\'t perform logical reasoning (that\'s the reasoner\'s job) or create ontologies from nothing—it acts as a sophisticated NLP pipeline that understands domain semantics well enough to populate a knowledge graph within an existing ontological framework. This is "LLMs empowering KGs" by automating the labor-intensive extraction process.'
    },
    {
      id: 16,
      type: 'temporal-modal',
      question: 'Which Description Logic extension would be most appropriate for representing: "Patients must eventually receive treatment within 24 hours of diagnosis"?',
      options: [
        'Modal Logic with ◊ (possibility operator)',
        'Temporal Logic with "Eventually" and time constraints',
        'Deontic Logic with O (obligation operator)',
        'Fuzzy Logic with degree of urgency [0,1]'
      ],
      correct: 1,
      explanation: 'This requirement has two components: temporal ordering ("eventually within 24 hours") and states changing over time. Temporal Logic is designed exactly for this—operators like "Eventually" (◇), "Always" (□), "Until", and time-bounded variants. Modal Logic handles possibility/necessity but doesn\'t inherently model time progression. Deontic Logic models obligations but lacks temporal sequencing. While you could combine Deontic + Temporal (obligation + time), the question emphasizes the temporal constraint, making Temporal Logic the primary choice. In practice, healthcare ontologies often use temporal extensions to track disease progression and treatment timelines.'
    },
    {
      id: 17,
      type: 'ontology-selection',
      question: 'You\'re building a medical diagnosis system requiring fast query response over millions of patient records with complex class hierarchies. Which OWL profile is most suitable?',
      options: [
        'OWL Full for maximum expressiveness',
        'OWL DL for complete reasoning capabilities',
        'OWL EL for large-scale classification with guaranteed polynomial reasoning',
        'OWL RL for rule-based inference'
      ],
      correct: 2,
      explanation: 'OWL EL (Existential Language) is specifically designed for this use case! It\'s the fragment used by SNOMED CT (300,000+ medical classes). EL supports: concept intersection, existential restrictions (∃), and role hierarchies—perfect for modeling "Disease ⊓ ∃hasSymptom.Fever". Most importantly, EL guarantees polynomial-time reasoning even with massive class hierarchies. OWL DL (SHOIN) would be too slow. OWL Full is computationally prohibitive. OWL RL focuses on rule-based inference rather than subsumption reasoning. For large-scale healthcare KGs with deep hierarchies and existential constraints, EL is the gold standard.'
    },
    {
      id: 18,
      type: 'property-chain-reasoning',
      question: 'Given: hasParent ∘ hasSibling ≡ hasUncleOrAunt (property chain). If hasParent and hasSibling are both transitive, what additional relationships are inferred?',
      options: [
        'Only direct uncles/aunts—transitivity doesn\'t affect property chains',
        'Transitivity will cascade through the chain, inferring grand-uncles/aunts, cousins\' parents, etc.',
        'The ontology becomes inconsistent because chains and transitivity conflict',
        'Transitivity is ignored in property chain axioms'
      ],
      correct: 1,
      explanation: 'This creates a reasoning cascade! Transitivity on hasParent means it chains through multiple generations. Transitivity on hasSibling means it connects all siblings (not just direct). When combined in a property chain: hasParent(you, parent) ∧ hasParent(parent, grandparent) [transitive] ∧ hasSibling(grandparent, grand-uncle) [transitive] → hasUncleOrAunt(you, grand-uncle). The chain doesn\'t just stop at direct uncles—it propagates through generations and extended sibling relationships. This demonstrates why property chains with transitive properties can exponentially increase inferred triples. In practice, this might not match intuitive semantics of "uncle/aunt", showing the importance of careful property design.'
    },
    {
      id: 19,
      type: 'unique-name-assumption',
      question: 'Your KB contains: Alex hasBirthdate "1990-01-01" and Alexander hasBirthdate "1990-01-01". Without additional axioms, what does the reasoner conclude?',
      options: [
        'Alex and Alexander are the same individual (owl:sameAs)',
        'Alex and Alexander are different individuals (owl:differentFrom)',
        'Neither—OWL makes no assumption about name uniqueness',
        'The reasoner will prompt for user clarification'
      ],
      correct: 2,
      explanation: 'OWL explicitly does NOT have a Unique Name Assumption (UNA)! Different names might refer to the same individual. Shared properties (like birthdate) don\'t automatically trigger sameAs inference unless you\'ve made hasBirthdate an InverseFunctional property. Without explicit owl:sameAs or owl:differentFrom assertions, Alex and Alexander remain distinct in the ABox but potentially the same in reality. This is why ontology designers must explicitly assert distinctness (owl:AllDifferent for groups) or use inverse functional properties to trigger merging. The lack of UNA reflects OWL\'s open-world, integration-friendly philosophy.'
    },
    {
      id: 20,
      type: 'comprehensive-design',
      question: 'You\'re designing an ontology for a collaborative research platform. Researchers can lead projects, projects must have exactly one leader, and researchers can participate in multiple projects. Which combination correctly models this?',
      options: [
        'leads: functional, inverse functional; participatesIn: no restrictions',
        'leads: functional; participatesIn: inverse functional',
        'leads: inverse functional; participatesIn: no restrictions',
        'leads: no restrictions; participatesIn: functional'
      ],
      correct: 2,
      explanation: 'Let\'s break down the requirements: (1) "Researchers can lead projects" → no functional restriction on leads (one researcher → multiple projects). (2) "Projects must have exactly one leader" → leads is INVERSE functional (one project ← one researcher). This means from the project\'s perspective, leadsProject (inverse of leads) is functional. (3) "Researchers can participate in multiple projects" → participatesIn has no functional restrictions in either direction. The key insight: inverse functional enforces uniqueness on the RANGE side (projects can have only one leader), while functional would enforce uniqueness on the DOMAIN side (researchers could lead only one project, which contradicts requirement 1).'
    }
  ];

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const toggleExplanation = (questionId) => {
    setShowExplanation({
      ...showExplanation,
      [questionId]: !showExplanation[questionId]
    });
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) correct++;
    });
    return correct;
  };

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return '#10b981';
    if (percentage >= 80) return '#3b82f6';
    if (percentage >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setShowExplanation({});
  };

  if (showResults) {
    const score = calculateScore();
    const total = questions.length;
    const percentage = ((score / total) * 100).toFixed(1);

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        padding: '2rem',
        fontFamily: '"Merriweather", Georgia, serif'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '3rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Award size={80} color={getScoreColor(score, total)} style={{ margin: '0 auto 1rem' }} />
            <h1 style={{
              fontSize: '2.5rem',
              color: '#1e293b',
              marginBottom: '0.5rem',
              fontWeight: 700
            }}>
              Quiz Complete!
            </h1>
            <div style={{
              fontSize: '4rem',
              fontWeight: 900,
              color: getScoreColor(score, total),
              marginBottom: '0.5rem',
              fontFamily: '"Courier New", monospace'
            }}>
              {score}/{total}
            </div>
            <div style={{
              fontSize: '1.5rem',
              color: '#64748b',
              fontFamily: '"Courier New", monospace'
            }}>
              {percentage}% Correct
            </div>
          </div>

          <div style={{
            background: '#f1f5f9',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              color: '#1e293b',
              marginBottom: '1rem',
              fontWeight: 600
            }}>
              Performance Analysis
            </h2>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                color: '#475569'
              }}>
                <span>Progress</span>
                <span>{percentage}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '20px',
                background: '#e2e8f0',
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${percentage}%`,
                  height: '100%',
                  background: getScoreColor(score, total),
                  transition: 'width 1s ease-out',
                  borderRadius: '10px'
                }} />
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginTop: '1.5rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>{score}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Correct</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444' }}>{total - score}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Incorrect</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              color: '#1e293b',
              marginBottom: '1rem',
              fontWeight: 600
            }}>
              Review Answers
            </h2>
            {questions.map((q, idx) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correct;
              return (
                <div key={q.id} style={{
                  marginBottom: '1rem',
                  border: `2px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <div
                    onClick={() => toggleExplanation(q.id)}
                    style={{
                      padding: '1rem',
                      background: isCorrect ? '#d1fae5' : '#fee2e2',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {isCorrect ? (
                        <Check size={24} color="#10b981" />
                      ) : (
                        <X size={24} color="#ef4444" />
                      )}
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#1e293b'
                      }}>
                        Question {idx + 1}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {showExplanation[q.id] ? 'Hide' : 'Show'} explanation
                    </span>
                  </div>
                  {showExplanation[q.id] && (
                    <div style={{ padding: '1.5rem', background: 'white' }}>
                      <p style={{
                        fontSize: '0.95rem',
                        color: '#1e293b',
                        marginBottom: '1rem',
                        lineHeight: 1.6
                      }}>
                        {q.question}
                      </p>
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#059669',
                          marginBottom: '0.5rem'
                        }}>
                          ✓ Correct Answer:
                        </div>
                        <div style={{
                          padding: '0.75rem',
                          background: '#d1fae5',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          color: '#1e293b'
                        }}>
                          {q.options[q.correct]}
                        </div>
                      </div>
                      {!isCorrect && userAnswer !== undefined && (
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#dc2626',
                            marginBottom: '0.5rem'
                          }}>
                            ✗ Your Answer:
                          </div>
                          <div style={{
                            padding: '0.75rem',
                            background: '#fee2e2',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            color: '#1e293b'
                          }}>
                            {q.options[userAnswer]}
                          </div>
                        </div>
                      )}
                      <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        background: '#f1f5f9',
                        borderRadius: '8px',
                        borderLeft: '4px solid #3b82f6'
                      }}>
                        <div style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#3b82f6',
                          marginBottom: '0.5rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Explanation
                        </div>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#475569',
                          lineHeight: 1.7,
                          margin: 0
                        }}>
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={resetQuiz}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 10px 20px rgba(99, 102, 241, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <RotateCcw size={20} />
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      padding: '2rem',
      fontFamily: '"Merriweather", Georgia, serif'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: 'white'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <Brain size={48} color="#8b5cf6" />
            <h1 style={{
              fontSize: '2.5rem',
              margin: 0,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Advanced OWL Mastery Quiz
            </h1>
          </div>
          <p style={{
            fontSize: '1rem',
            color: '#94a3b8',
            margin: 0,
            fontFamily: '"Courier New", monospace'
          }}>
            Deep Conceptual Understanding Test
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
            color: 'white',
            fontSize: '0.875rem',
            fontFamily: '"Courier New", monospace'
          }}>
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Question Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '2.5rem',
          marginBottom: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          {/* Question Type Badge */}
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            color: 'white',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1.5rem'
          }}>
            {currentQ.type.replace('-', ' ')}
          </div>

          {/* Question Text */}
          <h2 style={{
            fontSize: '1.5rem',
            color: '#1e293b',
            marginBottom: '2rem',
            lineHeight: 1.6,
            fontWeight: 600
          }}>
            {currentQ.question}
          </h2>

          {/* Answer Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentQ.options.map((option, idx) => {
              const isSelected = answers[currentQ.id] === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleAnswer(currentQ.id, idx)}
                  style={{
                    padding: '1.25rem',
                    border: isSelected ? '3px solid #8b5cf6' : '2px solid #e2e8f0',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: isSelected ? '#f3e8ff' : 'white',
                    transform: isSelected ? 'translateX(8px)' : 'translateX(0)',
                    boxShadow: isSelected ? '0 4px 12px rgba(139, 92, 246, 0.2)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.background = '#f8fafc';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.background = 'white';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: isSelected ? '3px solid #8b5cf6' : '2px solid #cbd5e1',
                      background: isSelected ? '#8b5cf6' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: isSelected ? 'white' : '#64748b',
                      fontFamily: '"Courier New", monospace',
                      flexShrink: 0
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span style={{
                      fontSize: '1rem',
                      color: '#1e293b',
                      lineHeight: 1.6
                    }}>
                      {option}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            style={{
              padding: '1rem 2rem',
              background: currentQuestion === 0 ? '#475569' : 'white',
              color: currentQuestion === 0 ? 'white' : '#1e293b',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
              opacity: currentQuestion === 0 ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
          >
            ← Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={() => setShowResults(true)}
              disabled={Object.keys(answers).length !== questions.length}
              style={{
                padding: '1rem 2rem',
                background: Object.keys(answers).length === questions.length
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : '#cbd5e1',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: Object.keys(answers).length === questions.length ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (Object.keys(answers).length === questions.length) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 20px rgba(16, 185, 129, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Submit Quiz
              <Award size={20} />
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 20px rgba(99, 102, 241, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Next
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Question Navigation Dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '2rem',
          flexWrap: 'wrap'
        }}>
          {questions.map((q, idx) => (
            <div
              key={q.id}
              onClick={() => setCurrentQuestion(idx)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: answers[q.id] !== undefined
                  ? '#10b981'
                  : idx === currentQuestion
                    ? '#8b5cf6'
                    : 'rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: idx === currentQuestion ? '2px solid white' : 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedOWLQuiz;
