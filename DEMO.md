# Demo script

## Four-minute presentation flow

### 1. Problem framing (30 seconds)
Explain that hotel inventory is fragmented across suppliers and that duplicate listings create confusion for customers and revenue teams. The platform solves this by merging duplicate hotels and comparing supplier offers transparently.

### 2. Supplier feed overview (45 seconds)
Show the /feeds page and explain how three suppliers contribute raw hotel rows. Highlight the search and supplier filter capabilities and note that the dataset is synthetic.

### 3. Catalogue and best offer (60 seconds)
Navigate to /catalogue and explain how hotel clusters are consolidated. Highlight a hotel with multiple offers and show why the recommended supplier wins based on value score, cancellation terms, and reliability.

### 4. Hotel detail review (45 seconds)
Open /hotels/[id] to show the complete master details and supplier comparison table. Emphasize the best-offer badge, the rationale, and the match explanation.

### 5. Review workflow (45 seconds)
Show /review and explain that uncertain hotel pairs appear side by side with a matching score and LLM rationale. Demonstrate approving or rejecting a match and point out that the decision is retained after refresh.

### 6. Accuracy dashboard (30 seconds)
Open /accuracy and show the comparison between naive baseline and engine metrics, including precision, recall, F1 score, look-alike false merges, and LLM calls.

## Exact website navigation steps

1. Load the home page.
2. Click `Feeds` in the top navigation.
3. Change the supplier filter to Supplier B and search for `Ibis`.
4. Open `Catalogue` and filter by Mumbai.
5. Select a hotel card and open its detail page.
6. Toggle `Show look-alikes` on the catalogue page.
7. Open `Review` and approve a pending pair.
8. Refresh the page and confirm the saved decision remains visible.
9. Open `Accuracy` to review performance metrics.

## Fallback plan if deployment is slow

If the backend or production deployment is slow, keep the frontend in mock mode by leaving `NEXT_PUBLIC_API_URL` empty. The UI will still render the expected flows and let the demo proceed without the live API.
