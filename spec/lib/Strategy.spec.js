const Strategy = require('../../lib/Strategy');
const Card = require('../../lib/Card');
const Hand = require('../../lib/Hand');

const [ace, two, three, four, five, six, seven, eight, nine, ten] = Card.values;

describe('lib/Strategy', () => {
  describe('dealer()', () => {
    const { hit, stand } = Strategy.actions;
    const hand = Hand.create();

    describe('when hand value is less than 17', () => {
      hand.cards = [ten, three, three];
      const result = Strategy.dealer(hand);

      it('returns hit', () => {
        expect(result).toEqual(hit);
      });
    });

    describe('when hand value is 17', () => {
      describe('and the hand contains a soft ace', () => {
        hand.cards = [ace, three, three];
        const result = Strategy.dealer(hand);

        it('returns hit', () => {
          expect(result).toEqual(hit);
        });
      });

      describe('and the hand contains no soft ace', () => {
        hand.cards = [ten, ace, six];
        const result = Strategy.dealer(hand);

        it('returns stand', () => {
          expect(result).toEqual(stand);
        });
      });

      describe('and the hand contains no aces', () => {
        hand.cards = [ten, seven];
        const result = Strategy.dealer(hand);

        it('returns stand', () => {
          expect(result).toEqual(stand);
        });
      });
    });

    describe('when hand value is greater than 17', () => {
      hand.cards = [ten, five, three];
      const result = Strategy.dealer(hand);

      it('returns stand', () => {
        expect(result).toEqual(stand);
      });
    });
  });

  describe('basic()', () => {
    function getResponses (playerCards, dealerCards, doubleDownIsAllowed, surrenderIsAllowed) {
      const hand = Hand.create();
      hand.cards = playerCards;

      return dealerCards.map(dealerCard => {
        return Strategy.basic(hand, dealerCard, doubleDownIsAllowed, surrenderIsAllowed);
      });
    }

    function allResponsesMatch (responses, action) {
      return responses.every(response => response === action);
    }

    const { hit, stand, doubleDown, surrender } = Strategy.actions;

    describe('when the hand value is 5', () => {
      const playerCards = [two, three];
      const dealerCards = [two, three, four, five, six, seven, eight, nine, ten, ace];
      const responses = getResponses(playerCards, dealerCards);

      it('returns hit', () => {
        expect(allResponsesMatch(responses, hit)).toBe(true);
      });
    });

    describe('when the hand value is 6', () => {
      const playerCards = [two, four];
      const dealerCards = [two, three, four, five, six, seven, eight, nine, ten, ace];
      const responses = getResponses(playerCards, dealerCards);

      it('returns hit', () => {
        expect(allResponsesMatch(responses, hit)).toBe(true);
      });
    });

    describe('when the hand value is 7', () => {
      const playerCards = [three, four];
      const dealerCards = [two, three, four, five, six, seven, eight, nine, ten, ace];
      const responses = getResponses(playerCards, dealerCards);

      it('returns hit', () => {
        expect(allResponsesMatch(responses, hit)).toBe(true);
      });
    });

    describe('when the hand value is 8', () => {
      const playerCards = [two, six];
      const dealerCards = [two, three, four, five, six, seven, eight, nine, ten, ace];
      const responses = getResponses(playerCards, dealerCards);

      it('returns hit', () => {
        expect(allResponsesMatch(responses, hit)).toBe(true);
      });
    });

    describe('when the hand value is 9', () => {
      const playerCards = [two, seven];

      describe('and dealer shows 2, 7, 8, 9, 10 or Ace', () => {
        const dealerCards = [two, seven, eight, nine, ten, ace];
        const responses = getResponses(playerCards, dealerCards);

        it('returns hit', () => {
          expect(allResponsesMatch(responses, hit)).toBe(true);
        });
      });

      describe('and dealer shows 3, 4, 5 or 6', () => {
        const dealerCards = [three, four, five, six];

        describe('and double down is allowed', () => {
          const responses = getResponses(playerCards, dealerCards, true);

          it('returns double down', () => {
            expect(allResponsesMatch(responses, doubleDown)).toBe(true);
          });
        });

        describe('and double down is not allowed', () => {
          const responses = getResponses(playerCards, dealerCards, false);

          it('returns hit', () => {
            expect(allResponsesMatch(responses, hit)).toBe(true);
          });
        });
      });
    });

    describe('when the hand value is 10', () => {
      const playerCards = [three, seven];

      describe('and dealer shows 2, 3, 4, 5, 6, 7, 8 or 9', () => {
        const dealerCards = [two, three, four, five, six, seven, eight, nine];

        describe('and double down is allowed', () => {
          const responses = getResponses(playerCards, dealerCards, true);

          it('returns double down', () => {
            expect(allResponsesMatch(responses, doubleDown)).toBe(true);
          });
        });

        describe('and double down is not allowed', () => {
          const responses = getResponses(playerCards, dealerCards, false);

          it('returns hit', () => {
            expect(allResponsesMatch(responses, hit)).toBe(true);
          });
        });
      });

      describe('and dealer shows 10 or Ace', () => {
        const dealerCards = [ten, ace];
        const responses = getResponses(playerCards, dealerCards);

        it('returns hit', () => {
          expect(allResponsesMatch(responses, hit)).toBe(true);
        });
      });
    });

    describe('when the hand value is 11', () => {
      const playerCards = [three, eight];
      const dealerCards = [two, three, four, five, six, seven, eight, nine, ten, ace];

      describe('and double down is allowed', () => {
        const responses = getResponses(playerCards, dealerCards, true);

        it('returns double down', () => {
          expect(allResponsesMatch(responses, doubleDown)).toBe(true);
        });
      });

      describe('and double down is not allowed', () => {
        const responses = getResponses(playerCards, dealerCards, false);

        it('returns hit', () => {
          expect(allResponsesMatch(responses, hit)).toBe(true);
        });
      });
    });

    describe('when the hand value is 12', () => {
      const playerCards = [ten, two];

      describe('and dealer shows 2, 3, 7, 8, 9, 10, or Ace', () => {
        const dealerCards = [two, three, seven, eight, nine, ten, ace];
        const responses = getResponses(playerCards, dealerCards);

        it('returns hit', () => {
          expect(allResponsesMatch(responses, hit)).toBe(true);
        });
      });

      describe('and dealer shows 4, 5, or 6', () => {
        const dealerCards = [four, five, six];
        const responses = getResponses(playerCards, dealerCards);

        it('returns stand', () => {
          expect(allResponsesMatch(responses, stand)).toBe(true);
        });
      });
    });

    describe('when the hand value is 13', () => {
      describe('and the hand is hard', () => {
        const playerCards = [ten, three];

        describe('and the dealer shows 2, 3, 4, 5, or 6', () => {
          const dealerCards = [two, three, four, five, six];
          const responses = getResponses(playerCards, dealerCards);

          it('returns stand', () => {
            expect(allResponsesMatch(responses, stand)).toBe(true);
          });
        });

        describe('and the dealer shows 7, 8, 9, 10, or Ace', () => {
          const dealerCards = [seven, eight, nine, ten, ace];
          const responses = getResponses(playerCards, dealerCards);

          it('returns hit', () => {
            expect(allResponsesMatch(responses, hit)).toBe(true);
          });
        });
      });

      describe('and the hand is soft', () => {
        const playerCards = [ace, two];

        describe('and the dealer shows 2, 3, 4, 7, 8, 9, 10, or Ace', () => {
          const dealerCards = [two, three, four, seven, eight, nine, ten, ace];
          const responses = getResponses(playerCards, dealerCards);

          it('returns hit', () => {
            expect(allResponsesMatch(responses, hit)).toBe(true);
          });
        });

        describe('and the dealer shows 5 or 6', () => {
          const dealerCards = [five, six];

          describe('and double down is allowed', () => {
            const responses = getResponses(playerCards, dealerCards, true);

            it('returns double down', () => {
              expect(allResponsesMatch(responses, doubleDown)).toBe(true);
            });
          });

          describe('and double down is not allowed', () => {
            const responses = getResponses(playerCards, dealerCards, false);

            it('returns hit', () => {
              expect(allResponsesMatch(responses, hit)).toBe(true);
            });
          });
        });
      });
    });

    describe('when the hand value is 14', () => {
      describe('and the hand is hard', () => {
        const playerCards = [ten, four];

        describe('and the dealer shows 2, 3, 4, 5, or 6', () => {
          const dealerCards = [two, three, four, five, six];
          const responses = getResponses(playerCards, dealerCards);

          it('returns stand', () => {
            expect(allResponsesMatch(responses, stand)).toBe(true);
          });
        });

        describe('and the dealer shows 7, 8, 9, 10, or Ace', () => {
          const dealerCards = [seven, eight, nine, ten, ace];
          const responses = getResponses(playerCards, dealerCards);

          it('returns hit', () => {
            expect(allResponsesMatch(responses, hit)).toBe(true);
          });
        });
      });

      describe('and the hand is soft', () => {
        const playerCards = [ace, three];

        describe('and the dealer shows 2, 3, 4, 7, 8, 9, 10, or Ace', () => {
          const dealerCards = [two, three, four, seven, eight, nine, ten, ace];
          const responses = getResponses(playerCards, dealerCards);

          it('returns hit', () => {
            expect(allResponsesMatch(responses, hit)).toBe(true);
          });
        });

        describe('and the dealer shows 5 or 6', () => {
          const dealerCards = [five, six];

          describe('and double down is allowed', () => {
            const responses = getResponses(playerCards, dealerCards, true);

            it('returns double down', () => {
              expect(allResponsesMatch(responses, doubleDown)).toBe(true);
            });
          });

          describe('and double down is not allowed', () => {
            const responses = getResponses(playerCards, dealerCards, false);

            it('returns hit', () => {
              expect(allResponsesMatch(responses, hit)).toBe(true);
            });
          });
        });
      });
    });

    describe('when the hand value is 15', () => {
      describe('and the hand is hard', () => {
        const playerCards = [ten, five];

        describe('and the dealer shows 2, 3, 4, 5, or 6', () => {
          const dealerCards = [two, three, four, five, six];
          const responses = getResponses(playerCards, dealerCards);

          it('returns stand', () => {
            expect(allResponsesMatch(responses, stand)).toBe(true);
          });
        });

        describe('and the dealer shows 7, 8, or 9', () => {
          const dealerCards = [seven, eight, nine];
          const responses = getResponses(playerCards, dealerCards);

          it('returns hit', () => {
            expect(allResponsesMatch(responses, hit)).toBe(true);
          });
        });

        describe('and the dealer shows 10 or Ace', () => {
          const dealerCards = [ten, ace];

          describe('when surrender is allowed', () => {
            const responses = getResponses(playerCards, dealerCards, true, true);

            it('returns surrender', () => {
              expect(allResponsesMatch(responses, surrender)).toBe(true);
            });
          });

          describe('when surrender is not allowed', () => {
            const responses = getResponses(playerCards, dealerCards, true, false);
            
            it('returns hit', () => {
              expect(allResponsesMatch(responses, hit)).toBe(true);
            });
          });
        });
      });

      describe('and the hand is soft', () => {
        const playerCards = [ace, four];

        describe('and the dealer shows 2, 3, 4, 7, 8, 9, 10, or Ace', () => {
          const dealerCards = [two, three, seven, eight, nine, ten, ace];
          const responses = getResponses(playerCards, dealerCards);

          it('returns hit', () => {
            expect(allResponsesMatch(responses, hit)).toBe(true);
          });
        });

        describe('and the dealer shows 4, 5 or 6', () => {
          const dealerCards = [four, five, six];

          describe('and double down is allowed', () => {
            const responses = getResponses(playerCards, dealerCards, true);

            it('returns double down', () => {
              expect(allResponsesMatch(responses, doubleDown)).toBe(true);
            });
          });

          describe('and double down is not allowed', () => {
            const responses = getResponses(playerCards, dealerCards, false);

            it('returns hit', () => {
              expect(allResponsesMatch(responses, hit)).toBe(true);
            });
          });
        });
      });
    });

    describe('when the hand value is 16', () => {
      describe('and the hand is hard', () => {
        const playerCards = [ten, six];

        describe('and the dealer shows 2, 3, 4, 5, or 6', () => {
          const dealerCards = [two, three, four, five, six];
          const responses = getResponses(playerCards, dealerCards);

          it('returns stand', () => {
            expect(allResponsesMatch(responses, stand)).toBe(true);
          });
        });

        describe('and the dealer shows 7 or 8', () => {
          const dealerCards = [seven, eight];
          const responses = getResponses(playerCards, dealerCards);

          it('returns hit', () => {
            expect(allResponsesMatch(responses, hit)).toBe(true);
          });
        });

        describe('and the dealer shows 9, 10 or Ace', () => {
          const dealerCards = [nine, ten, ace];

          describe('when surrender is allowed', () => {
            const responses = getResponses(playerCards, dealerCards, true, true);

            it('returns surrender', () => {
              expect(allResponsesMatch(responses, surrender)).toBe(true);
            });
          });

          describe('when surrender is not allowed', () => {
            const responses = getResponses(playerCards, dealerCards, true, false);
            
            it('returns hit', () => {
              expect(allResponsesMatch(responses, hit)).toBe(true);
            });
          });
        });
      });

      describe('and the hand is soft', () => {
        const playerCards = [ace, five];

        describe('and the dealer shows 2, 3, 4, 7, 8, 9, 10, or Ace', () => {
          const dealerCards = [two, three, seven, eight, nine, ten, ace];
          const responses = getResponses(playerCards, dealerCards);

          it('returns hit', () => {
            expect(allResponsesMatch(responses, hit)).toBe(true);
          });
        });

        describe('and the dealer shows 4, 5 or 6', () => {
          const dealerCards = [four, five, six];

          describe('and double down is allowed', () => {
            const responses = getResponses(playerCards, dealerCards, true);

            it('returns double down', () => {
              expect(allResponsesMatch(responses, doubleDown)).toBe(true);
            });
          });

          describe('and double down is not allowed', () => {
            const responses = getResponses(playerCards, dealerCards, false);

            it('returns hit', () => {
              expect(allResponsesMatch(responses, hit)).toBe(true);
            });
          });
        });
      });
    });

    describe('when the hand value is 17', () => {
      describe('and the hand is hard', () => {
        const playerCards = [ten, seven];

        describe('and the dealer shows 2, through ten', () => {
          const dealerCards = [two, three, four, five, six, seven, eight, nine, ten];
          const responses = getResponses(playerCards, dealerCards);

          it('returns stand', () => {
            expect(allResponsesMatch(responses, stand)).toBe(true);
          });
        });

        describe('and the dealer shows Ace', () => {
          const dealerCards = [ace];
          const responses = getResponses(playerCards, dealerCards);

          describe('when surrender is allowed', () => {
            const responses = getResponses(playerCards, dealerCards, true, true);

            it('returns surrender', () => {
              expect(allResponsesMatch(responses, surrender)).toBe(true);
            });
          });

          describe('when surrender is not allowed', () => {
            const responses = getResponses(playerCards, dealerCards, true, false);
            
            it('returns stannd', () => {
              expect(allResponsesMatch(responses, stand)).toBe(true);
            });
          });
        });
      });

      describe('and the hand is soft', () => {
        const playerCards = [ace, six];

        describe('and the dealer shows 2, 7, 8, 9, 10, or Ace', () => {
          const dealerCards = [two, seven, eight, nine, ten, ace];
          const responses = getResponses(playerCards, dealerCards);

          it('returns hit', () => {
            expect(allResponsesMatch(responses, hit)).toBe(true);
          });
        });

        describe('and the dealer shows 3, 4, 5 or 6', () => {
          const dealerCards = [three, four, five, six];

          describe('and double down is allowed', () => {
            const responses = getResponses(playerCards, dealerCards, true);

            it('returns double down', () => {
              expect(allResponsesMatch(responses, doubleDown)).toBe(true);
            });
          });

          describe('and double down is not allowed', () => {
            const responses = getResponses(playerCards, dealerCards, false);

            it('returns hit', () => {
              expect(allResponsesMatch(responses, hit)).toBe(true);
            });
          });
        });
      });
    });

    describe('when the hand value is 18', () => {
      describe('and the hand is hard', () => {
        const playerCards = [ten, eight];
        const dealerCards = [two, three, four, five, six, seven, eight, nine, ten, ace];
        const responses = getResponses(playerCards, dealerCards);

        it('returns stand', () => {
          expect(allResponsesMatch(responses, stand)).toBe(true);
        });
      });

      describe('and the hand is soft', () => {
        const playerCards = [ace, seven];

        describe('and the dealer shows 2, 3, 4, 5 or 6', () => {
          const dealerCards = [two, three, four, five, six];

          describe('and double down is allowed', () => {
            const responses = getResponses(playerCards, dealerCards, true);

            it('returns double down', () => {
              expect(allResponsesMatch(responses, doubleDown)).toBe(true);
            });
          });

          describe('and double down is not allowed', () => {
            const responses = getResponses(playerCards, dealerCards, false);

            it('returns stand', () => {
              expect(allResponsesMatch(responses, stand)).toBe(true);
            });
          });
        });

        describe('and the dealer shows 7 or 8', () => {
          const dealerCards = [seven, eight];
          const responses = getResponses(playerCards, dealerCards);

          it('returns stand', () => {
            expect(allResponsesMatch(responses, stand)).toBe(true);
          });
        });

        describe('and the dealer shows 9, 10 or Ace', () => {
          const dealerCards = [nine, ten, ace];
          const responses = getResponses(playerCards, dealerCards);

          it('returns hit', () => {
            expect(allResponsesMatch(responses, hit)).toBe(true);
          });
        });
      });
    });

    describe('when the hand value is 19', () => {
      describe('and the hand is hard', () => {
        const playerCards = [ten, nine];
        const dealerCards = [two, three, four, five, six, seven, eight, nine, ten, ace];
        const responses = getResponses(playerCards, dealerCards);

        it('returns stand', () => {
          expect(allResponsesMatch(responses, stand)).toBe(true);
        });
      });

      describe('and the hand is hard', () => {
        const playerCards = [ace, eight];

        describe('and the dealer shows 2, 3, 4 or 5', () => {
          const dealerCards = [two, three, four, five, seven, eight, nine, ten, ace];
          const responses = getResponses(playerCards, dealerCards);

          it('returns stand', () => {
            expect(allResponsesMatch(responses, stand)).toBe(true);
          });
        });

        describe('and the dealer shows 6', () => {
          const dealerCards = [six];

          describe('and double down is allowed', () => {
            const responses = getResponses(playerCards, dealerCards, true);

            it('returns double down', () => {
              expect(allResponsesMatch(responses, doubleDown)).toBe(true);
            });
          });

          describe('and double down is not allowed', () => {
            const responses = getResponses(playerCards, dealerCards, false);

            it('returns stand', () => {
              expect(allResponsesMatch(responses, stand)).toBe(true);
            });
          });
        });
      });
    });

    describe('when the hand value is 20', () => {
      describe('and the hand is hard', () => {
        const playerCards = [ten, ten];
        const dealerCards = [two, three, four, five, six, seven, eight, nine, ten, ace];
        const responses = getResponses(playerCards, dealerCards);

        it('returns stand', () => {
          expect(allResponsesMatch(responses, stand)).toBe(true);
        });
      });

      describe('and the hand is soft', () => {
        const playerCards = [ace, nine];
        const dealerCards = [two, three, four, five, six, seven, eight, nine, ten, ace];
        const responses = getResponses(playerCards, dealerCards);

        it('returns stand', () => {
          expect(allResponsesMatch(responses, stand)).toBe(true);
        });
      });
    });

    describe('when the hand value is 21', () => {
      const playerCards = [ace, five, five];
      const dealerCards = [two, three, four, five, six, seven, eight, nine, ten, ace];
      const responses = getResponses(playerCards, dealerCards);

      it('returns stand', () => {
        expect(allResponsesMatch(responses, stand)).toBe(true);
      });
    });
  });
});
