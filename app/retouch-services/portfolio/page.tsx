import { BeforeAfterSlider } from '@/components/before-after-slider'
import { Badge } from '@/components/ui/badge'
import { retouchPortfolio } from '@/lib/retouch-data'

export const metadata = {
  title: 'Retouching Portfolio - Kolabo Studios',
  description: 'See our professional photo retouching work. Before and after examples of wedding, portrait, and commercial photography retouching.',
}

export default function RetouchPortfolioPage() {
  const categories = [...new Set(retouchPortfolio.map(item => item.category))]

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-sora">Retouching Portfolio</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our before and after gallery showcasing the transformation 
            our professional retouching brings to photography
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <Badge variant="outline" className="cursor-pointer">All</Badge>
          {categories.map((category) => (
            <Badge key={category} variant="outline" className="cursor-pointer">
              {category}
            </Badge>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 gap-12">
          {retouchPortfolio.map((item) => (
            <div key={item.id} className="space-y-6">
              <BeforeAfterSlider
                beforeImage={item.beforeImage}
                afterImage={item.afterImage}
                alt={item.title}
              />
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold font-sora">{item.title}</h2>
                  <Badge variant="secondary">{item.category}</Badge>
                </div>
                
                <p className="text-muted-foreground mb-4">
                  {item.description}
                </p>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Techniques Used:</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.techniques.map((technique, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {technique}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Want to see more examples or discuss your specific needs?
          </p>
          <div className="space-x-4">
            <button className="text-primary hover:underline">Load More Examples</button>
            <span className="text-muted-foreground">•</span>
            <button className="text-primary hover:underline">Contact Us</button>
          </div>
        </div>
      </div>
    </div>
  )
}
