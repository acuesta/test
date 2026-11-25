import { GetInvestigation } from '../src/application/investigation/get-investigation';
import { SubmitSolution } from '../src/application/investigation/submit-solution';
import { CASE_CATALOG } from '../src/domain/investigation/case-catalog';
import { evaluateStatement } from '../src/domain/investigation/statement';
import { solveCase } from '../src/domain/investigation/solve-case';
import { ROSTER } from '../src/domain/investigation/suspects';

describe('investigation rules', () => {
  it('treats a diet claim as true when any culprit matches', () => {
    const suspects = ROSTER.slice(0, 3);
    const guilty = new Set(['peacock' as const]);
    const truthful = new Set(['panther' as const]);

    expect(
      evaluateStatement({ kind: 'diet', diet: 'herbivore' }, 0, suspects, guilty, truthful),
    ).toBe(true);
    expect(
      evaluateStatement({ kind: 'diet', diet: 'carnivore' }, 0, suspects, guilty, truthful),
    ).toBe(false);
  });

  it('treats an or-claim as false only when every named suspect is innocent', () => {
    const suspects = ROSTER.slice(0, 3);
    const bothInnocent = new Set(['shark' as const]);
    const oneGuilty = new Set(['panther' as const]);

    expect(
      evaluateStatement(
        { kind: 'any-accused', suspectIds: ['panther', 'peacock'] },
        2,
        suspects,
        bothInnocent,
        new Set(),
      ),
    ).toBe(false);
    expect(
      evaluateStatement(
        { kind: 'any-accused', suspectIds: ['panther', 'peacock'] },
        2,
        suspects,
        oneGuilty,
        new Set(),
      ),
    ).toBe(true);
  });

  it('counts either neighbor in the circle', () => {
    const suspects = ROSTER.slice(0, 4);
    const guilty = new Set(['iguana' as const]);

    expect(
      evaluateStatement({ kind: 'neighbor-guilty' }, 0, suspects, guilty, new Set()),
    ).toBe(true);
  });

  it('gives every published case one culprit set', () => {
    for (const investigation of CASE_CATALOG) {
      expect(solveCase(investigation)).toHaveLength(1);
    }
  });

  it('solves the opening cases', () => {
    expect(solveCase(CASE_CATALOG[0])).toEqual([['shark']]);
    expect(solveCase(CASE_CATALOG[1])).toEqual([['peacock']]);
    expect(solveCase(CASE_CATALOG[2])).toEqual([['shark']]);
    expect(solveCase(CASE_CATALOG[3])).toEqual([['peacock', 'shark']]);
  });
});

describe('submit a solution', () => {
  const submit = new SubmitSolution();
  const get = new GetInvestigation();

  it('hides the solution until a guess is checked', () => {
    const view = get.execute('taller-than-190');
    expect(view.statements.map((statement) => statement.text)).toEqual([
      'Someone taller than 190 cm did it.',
      'I did not do it.',
      'Peacock is lying.',
    ]);
    expect(JSON.stringify(view)).not.toContain('culprits');
  });

  it('awards three stars for a fast correct answer', () => {
    expect(
      submit.execute({
        caseId: 'taller-than-190',
        culprits: ['shark'],
        elapsedSeconds: 90,
      }),
    ).toEqual({ correct: true, stars: 3, culprits: ['shark'] });
  });

  it('scores a wrong answer as zero and still reveals the solution', () => {
    expect(
      submit.execute({
        caseId: 'two-culprits',
        culprits: ['panther', 'peacock'],
        elapsedSeconds: 10,
      }),
    ).toEqual({ correct: false, stars: 0, culprits: ['peacock', 'shark'] });
  });
});
