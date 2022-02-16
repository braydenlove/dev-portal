import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import Tabs, { Tab } from '.'

describe('<Tabs />', () => {
  const testData = [
    { heading: 'Tab 1', content: 'content in tab 1' },
    { heading: 'Tab 2', content: 'content in tab 2' },
  ]
  let container: HTMLElement

  beforeEach(() => {
    const results = render(
      <Tabs>
        {testData.map(({ heading, content }, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Tab heading={heading} key={index}>
            {content}
          </Tab>
        ))}
      </Tabs>
    )
    container = results.container
  })

  describe('with only required props', () => {
    test('has no violations identified by axe-core', (done) => {
      axe.run(container, {}, (err, { violations }) => {
        expect(err).toBeNull()
        expect(violations).toHaveLength(0)
        done()
      })
    })

    test('has a role="tablist" with the correct properties', () => {
      const tablist = screen.queryByRole('tablist')
      expect(tablist).toBeInTheDocument()
      expect(tablist).not.toHaveAccessibleName()
    })

    test('has the correct number of role="tab" and role="tabpanel" elements with the correct properties', () => {
      testData.forEach(({ heading, content }, index) => {
        /**
         * This query tests the:
         *  - `heading` prop by find a tab button based on the text in the prop
         *  - `aria-selected` prop by checking the index of the tab/panel pair
         *    getting rendered
         */
        const tabButton = screen.queryByRole('tab', {
          name: heading,
          selected: index === 0,
        })

        /**
         * This query tests the:
         *  - `aria-labelledby` prop on tab panels by checking for a `name` that
         *    is equal to the associated tab button's text
         *  - `aria-hidden` prop by checking the index of the tab/panel pair
         *    getting rendered
         */
        const tabPanel = screen.queryByRole('tabpanel', {
          name: heading,
          hidden: index > 0,
        })

        /**
         * Tab button assertions
         *
         * TODO: not sure how to test `aria-controls` or `id` attributes better
         * yet since only the active (first, in this case) tab panel is in the
         * document.
         */
        expect(tabButton).toBeInTheDocument()
        expect(tabButton).toHaveAccessibleName()
        expect(tabButton.getAttribute('aria-controls')).toBeDefined()
        expect(tabButton.getAttribute('id')).toBeDefined()
        expect(tabButton.getAttribute('tabindex')).toBe(
          index === 0 ? '0' : '-1'
        )

        /**
         * Tab panel assertions
         *
         * Only the active tab panel will be in the document because of the CSS
         * we apply that hides non-active panels.
         */
        if (index === 0) {
          expect(tabPanel).toBeInTheDocument()
          expect(tabPanel).toHaveAccessibleName()
          expect(tabPanel.getAttribute('tabindex')).toBe('0')
          expect(tabPanel.textContent).toBe(content)
        } else {
          expect(tabPanel).not.toBeInTheDocument()
        }
      })
    })
  })

  test('changes the active tab via mouse click', () => {
    /**
     * Queries for the second tab button by text and asserts checks that it is
     * not already selected, which it should not be since the first tab is
     * active by default.
     */
    const secondTabButton = screen.queryByRole('tab', {
      name: testData[1].heading,
      selected: false,
    })

    userEvent.click(secondTabButton)

    /**
     * Checks that the first tab panel is no longer active and visible in the
     * document.
     */
    const firstTabPanel = screen.queryByRole('tabpanel', {
      name: testData[0].heading,
    })
    expect(firstTabPanel).not.toBeInTheDocument()

    /**
     * Checks that the second tab panel is active, in the document, and that it
     * has the correct content.
     */
    const secondTabPanel = screen.queryByRole('tabpanel', {
      name: testData[1].heading,
    })
    expect(secondTabPanel).toBeInTheDocument()
    expect(secondTabPanel.textContent).toBe(testData[1].content)
  })

  test('does not change the active tab `onKeyDown`', () => {
    const keysToTest = ['Enter', ' ', 'ArrowRight', 'ArrowLeft']
    keysToTest.forEach((key) => {
      const secondTabButton = screen.queryByRole('tab', {
        name: testData[1].heading,
      })
      fireEvent.keyDown(secondTabButton, { key })

      const firstTabPanel = screen.queryByRole('tabpanel', {
        name: testData[0].heading,
      })
      expect(firstTabPanel).toBeInTheDocument()
    })
  })

  describe('`onKeyUp`', () => {
    test('Enter and space keys do nothing', () => {
      const keysToTest = ['Enter', ' ']
      keysToTest.forEach((key) => {
        const secondTabButton = screen.queryByRole('tab', {
          name: testData[1].heading,
        })
        fireEvent.keyDown(secondTabButton, { key })

        const firstTabPanel = screen.queryByRole('tabpanel', {
          name: testData[0].heading,
        })
        expect(firstTabPanel).toBeInTheDocument()
      })
    })

    test.todo(
      'ArrowRight and ArrowLeft keys set the next and previous tab active, respectively'
    )

    test.todo('Focus wraps to the first tab button from the last on ArrowRight')

    test.todo('Focus wraps to the last tab button from the first on ArrowLeft')
  })
})
