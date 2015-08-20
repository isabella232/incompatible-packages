/** @babel */

import path from 'path'
import IncompatiblePackagesComponent from '../lib/incompatible-packages-component'
import StatusIconComponent from '../lib/status-icon-component'

describe('Incompatible packages', () => {
  let statusBar

  beforeEach(() => {
    atom.views.getView(atom.workspace)

    waitsForPromise(() => atom.packages.activatePackage('status-bar'))

    runs(() => {
      statusBar = atom.workspace.getBottomPanels()[0].getItem()
    })
  })

  describe('when there are packages with incompatible native modules', () => {
    beforeEach(() => {
      let incompatiblePackage = atom.packages.loadPackage(
        path.join(__dirname, 'fixtures', 'incompatible-package')
      )
      spyOn(incompatiblePackage, 'isCompatible').andReturn(false)

      waitsForPromise(() => atom.packages.activatePackage("incompatible-packages"))

      waits(1)
    })

    it('adds an icon to the status bar', () => {
      let statusBarIcon = statusBar.getRightTiles()[0].getItem()
      expect(statusBarIcon.constructor).toBe(StatusIconComponent)
    })

    describe('clicking the icon', () => {
      it('displays the incompatible packages view in a pane', () => {
        let statusBarIcon = statusBar.getRightTiles()[0].getItem()
        statusBarIcon.element.dispatchEvent(new MouseEvent('click'))

        let activePaneItem
        waitsFor(() => (activePaneItem = atom.workspace.getActivePaneItem()))

        runs(() => {
          expect(activePaneItem.constructor).toBe(IncompatiblePackagesComponent)
        })
      })
    })
  })

  describe('when there are no packages with incompatible native modules', () => {
    beforeEach(() => {
      waitsForPromise(() => atom.packages.activatePackage("incompatible-packages"))
    })

    it('does not add an icon to the status bar', () => {
      let statusBarItemClasses = statusBar
        .getRightTiles()
        .map((tile) => tile.getItem().className)

      expect(statusBarItemClasses).not.toContain('incompatible-packages')
    })
  })
})
