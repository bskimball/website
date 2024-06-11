import { AlgoliaButton } from 'pliny/search/AlgoliaButton'
import { KBarButton } from 'pliny/search/KBarButton'
import { Button } from '@nextui-org/button'
import { useKBar } from 'kbar'
import siteMetadata from '@/data/siteMetadata'
import { HiMagnifyingGlass } from 'react-icons/hi2'

const SearchButton = () => {
  const { query } = useKBar()

  if (
    siteMetadata.search &&
    (siteMetadata.search.provider === 'algolia' || siteMetadata.search.provider === 'kbar')
  ) {
    const SearchButtonWrapper =
      siteMetadata.search.provider === 'algolia' ? AlgoliaButton : KBarButton

    return (
      <Button
        onClick={() => query.toggle()}
        radius="full"
        variant="light"
        className="min-w-0 w-16 h-16"
        aria-label="Search"
        color="primary"
      >
        <div className="text-2xl">
          <HiMagnifyingGlass />
        </div>
      </Button>
    )
  }
}

export default SearchButton
