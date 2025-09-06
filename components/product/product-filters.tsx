"use client"

import { useState } from "react"
import { ChevronDown, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterOptions {
  categories: { id: string; name: string; count: number }[]
  brands: { name: string; count: number }[]
  ageRanges: { range: string; count: number }[]
  priceRange: { min: number; max: number }
}

interface ProductFiltersProps {
  filters: FilterOptions
  onFilterChange: (filters: any) => void
  activeFilters: any
  className?: string
}

export function ProductFilters({ filters, onFilterChange, activeFilters, className }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState([activeFilters.minPrice || 0, activeFilters.maxPrice || 1000])
  const [isOpen, setIsOpen] = useState(false)

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const categories = activeFilters.categories || []
    const newCategories = checked ? [...categories, categoryId] : categories.filter((id: string) => id !== categoryId)

    onFilterChange({ ...activeFilters, categories: newCategories })
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    const brands = activeFilters.brands || []
    const newBrands = checked ? [...brands, brand] : brands.filter((b: string) => b !== brand)

    onFilterChange({ ...activeFilters, brands: newBrands })
  }

  const handleAgeRangeChange = (ageRange: string, checked: boolean) => {
    const ageRanges = activeFilters.ageRanges || []
    const newAgeRanges = checked ? [...ageRanges, ageRange] : ageRanges.filter((range: string) => range !== ageRange)

    onFilterChange({ ...activeFilters, ageRanges: newAgeRanges })
  }

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values)
    onFilterChange({
      ...activeFilters,
      minPrice: values[0],
      maxPrice: values[1],
    })
  }

  const handleSortChange = (sortBy: string) => {
    onFilterChange({ ...activeFilters, sortBy })
  }

  const clearFilters = () => {
    setPriceRange([0, 1000])
    onFilterChange({})
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <Label className="text-sm font-medium">Sort By</Label>
        <Select value={activeFilters.sortBy || "created_at"} onValueChange={handleSortChange}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Newest First</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="name">Name: A to Z</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium">Price Range</Label>
        <div className="mt-4 px-2">
          <Slider
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            max={filters.priceRange.max}
            min={filters.priceRange.min}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <Label className="text-sm font-medium">Categories</Label>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-3">
          {filters.categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={activeFilters.categories?.includes(category.id) || false}
                onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
              />
              <Label htmlFor={`category-${category.id}`} className="text-sm font-normal flex-1 cursor-pointer">
                {category.name} ({category.count})
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Brands */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <Label className="text-sm font-medium">Brands</Label>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-3">
          {filters.brands.map((brand) => (
            <div key={brand.name} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand.name}`}
                checked={activeFilters.brands?.includes(brand.name) || false}
                onCheckedChange={(checked) => handleBrandChange(brand.name, checked as boolean)}
              />
              <Label htmlFor={`brand-${brand.name}`} className="text-sm font-normal flex-1 cursor-pointer">
                {brand.name} ({brand.count})
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Age Ranges */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <Label className="text-sm font-medium">Age Range</Label>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-3">
          {filters.ageRanges.map((ageRange) => (
            <div key={ageRange.range} className="flex items-center space-x-2">
              <Checkbox
                id={`age-${ageRange.range}`}
                checked={activeFilters.ageRanges?.includes(ageRange.range) || false}
                onCheckedChange={(checked) => handleAgeRangeChange(ageRange.range, checked as boolean)}
              />
              <Label htmlFor={`age-${ageRange.range}`} className="text-sm font-normal flex-1 cursor-pointer">
                {ageRange.range} ({ageRange.count})
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
        <X className="mr-2 h-4 w-4" />
        Clear All Filters
      </Button>
    </div>
  )

  return (
    <>
      {/* Desktop Filters */}
      <div className={`hidden lg:block ${className}`}>
        <div className="sticky top-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filters</h3>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filters */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Refine your search to find the perfect products</SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
